import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { File, Storage } from "@google-cloud/storage";
import {
  canAccessObject,
  getObjectAclPolicy,
  ObjectAclPolicy,
  ObjectPermission,
  setObjectAclPolicy,
} from "./objectAcl";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const storageBackend = process.env.OBJECT_STORAGE_BACKEND || (process.env.REPL_ID ? "replit" : "gcs");
if (!["replit", "gcs"].includes(storageBackend)) {
  throw new Error("OBJECT_STORAGE_BACKEND must be replit or gcs.");
}

function externalStorage(): Storage {
  if (!process.env.GCS_CREDENTIALS_JSON) {
    return new Storage({ projectId: process.env.GOOGLE_CLOUD_PROJECT || undefined });
  }
  try {
    const credentials = JSON.parse(process.env.GCS_CREDENTIALS_JSON);
    if (!credentials.client_email || !credentials.private_key) throw new Error("Missing credential fields");
    return new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT || credentials.project_id,
      credentials,
    });
  } catch {
    // Never log parsed credentials or JSON parsing snippets containing secrets.
    throw new Error("GCS_CREDENTIALS_JSON must contain valid Google service-account credentials.");
  }
}

export const objectStorageClient = storageBackend === "gcs" ? externalStorage() : new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  getPublicObjectSearchPaths(): string[] {
    const paths = Array.from(
      new Set(
        (process.env.PUBLIC_OBJECT_SEARCH_PATHS || "")
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0),
      ),
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS is not set; provision App Storage first.",
      );
    }
    return paths;
  }

  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR is not set; provision App Storage first.",
      );
    }
    return dir;
  }

  async searchPublicObject(filePath: string): Promise<File | null> {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const { bucketName, objectName } = parseObjectPath(
        `${searchPath}/${filePath}`,
      );
      const file = objectStorageClient.bucket(bucketName).file(objectName);
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }
    return null;
  }

  async downloadObject(
    file: File,
    cacheTtlSec = 3600,
    isPublicObject = false,
  ): Promise<Response> {
    const [metadata] = await file.getMetadata();
    const aclPolicy = await getObjectAclPolicy(file);
    const isPublic = isPublicObject || aclPolicy?.visibility === "public";
    const webStream = Readable.toWeb(file.createReadStream()) as ReadableStream;
    const headers: Record<string, string> = {
      "Content-Type": (metadata.contentType as string) || "application/octet-stream",
      "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${cacheTtlSec}${isPublicObject ? ", immutable" : ""}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (metadata.size) {
      headers["Content-Length"] = String(metadata.size);
    }
    return new Response(webStream, { headers });
  }

  async getObjectEntityUploadURL(): Promise<string> {
    const objectId = randomUUID();
    const { bucketName, objectName } = parseObjectPath(
      `${this.getPrivateObjectDir()}/uploads/${objectId}`,
    );
    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900,
    });
  }

  async getObjectEntityFile(objectPath: string): Promise<File> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    const entityId = objectPath.slice("/objects/".length);
    if (!entityId || entityId.split("/").some((part) => !part || part === "." || part === "..")) {
      throw new ObjectNotFoundError();
    }
    const privateDir = this.getPrivateObjectDir().replace(/\/+$/, "");
    const { bucketName, objectName } = parseObjectPath(
      `${privateDir}/${entityId}`,
    );
    const file = objectStorageClient.bucket(bucketName).file(objectName);
    const [exists] = await file.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return file;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      return rawPath;
    }
    const rawObjectPath = new URL(rawPath).pathname;
    const privateDir = this.getPrivateObjectDir().replace(/\/+$/, "");
    if (!rawObjectPath.startsWith(`${privateDir}/`)) {
      return rawObjectPath;
    }
    return `/objects/${rawObjectPath.slice(privateDir.length + 1)}`;
  }

  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy,
  ): Promise<string> {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }
    const file = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(file, aclPolicy);
    return normalizedPath;
  }

  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: File;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    return canAccessObject({
      userId,
      objectFile,
      requestedPermission: requestedPermission ?? ObjectPermission.READ,
    });
  }
}

function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const [, bucketName, ...objectParts] = normalized.split("/");
  if (!bucketName || objectParts.length === 0 || objectParts.some((part) => !part)) {
    throw new Error("Invalid object path; expected a bucket and object name.");
  }
  return { bucketName, objectName: objectParts.join("/") };
}

async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string;
  objectName: string;
  method: "GET" | "PUT" | "DELETE" | "HEAD";
  ttlSec: number;
}): Promise<string> {
  if (storageBackend === "gcs") {
    const actions = { GET: "read", PUT: "write", DELETE: "delete", HEAD: "read" } as const;
    const [url] = await objectStorageClient.bucket(bucketName).file(objectName).getSignedUrl({
      version: "v4",
      action: actions[method],
      expires: Date.now() + ttlSec * 1000,
    });
    return url;
  }
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bucket_name: bucketName,
        object_name: objectName,
        method,
        expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
      }),
      signal: AbortSignal.timeout(30_000),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, error code: ${response.status}; ensure this runs on Replit.`,
    );
  }
  const result = (await response.json()) as { signed_url?: string };
  if (!result.signed_url) {
    throw new Error("Object Storage sidecar returned no signed URL.");
  }
  return result.signed_url;
}