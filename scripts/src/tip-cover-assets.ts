import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Storage } from "@google-cloud/storage";

export const LEGACY_TIP_COVER_SLUGS = [
  "why-us",
  "lg-discount",
  "kt-discount",
  "sk-discount",
  "new-vs-renewal",
  "84",
] as const;
export const MANAGED_TIP_COVER_COUNT = 179;
export const EXPECTED_TIP_COVER_COUNT =
  MANAGED_TIP_COVER_COUNT + LEGACY_TIP_COVER_SLUGS.length;
export const TIP_COVER_PREFIX = "tip-covers";
export const TIP_COVER_URL_PREFIX = "/api/storage/public-objects/tip-covers";

const SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export const tipCoverSourceDirectory = path.join(
  workspaceRoot,
  "attached_assets/generated_images/tip-covers",
);
export const tipCoverManifestPath = path.join(
  workspaceRoot,
  ".local/tip-cover-upload-manifest.json",
);
export const tipCoverDatabaseUrl = (slug: string): string =>
  `${TIP_COVER_URL_PREFIX}/${slug}.webp`;

export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export type TipCoverManifestEntry = {
  slug: string;
  objectPath: string;
  bytes: number;
  sha256: string;
};

export type TipCoverUploadManifest = {
  version: 1;
  expectedCount: number;
  uploadedAt: string;
  assets: TipCoverManifestEntry[];
};

export async function getExpectedTipCoverSlugs(): Promise<string[]> {
  const sourcePath = path.join(
    workspaceRoot,
    "artifacts/api-server/src/data/source-tips.json",
  );
  const source: unknown = JSON.parse(await readFile(sourcePath, "utf8"));
  if (!Array.isArray(source) || source.length !== MANAGED_TIP_COVER_COUNT) {
    throw new Error(
      `Expected exactly ${MANAGED_TIP_COVER_COUNT} managed source tips.`,
    );
  }

  const slugs: string[] = [];
  for (const [index, tip] of source.entries()) {
    if (
      !tip ||
      typeof tip !== "object" ||
      !("id" in tip) ||
      !("slug" in tip) ||
      typeof tip.id !== "string" ||
      typeof tip.slug !== "string" ||
      tip.id !== tip.slug ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        tip.slug,
      )
    ) {
      throw new Error(`Managed source tip at index ${index} has an invalid UUID slug.`);
    }
    slugs.push(tip.slug);
  }

  const allSlugs = [...slugs, ...LEGACY_TIP_COVER_SLUGS];
  if (new Set(allSlugs).size !== EXPECTED_TIP_COVER_COUNT) {
    throw new Error("Tip cover source slugs are not unique.");
  }
  return allSlugs;
}

export function getPublicObjectFile(objectPath: string) {
  if (
    !objectPath.startsWith(`${TIP_COVER_PREFIX}/`) ||
    objectPath.includes("\\") ||
    objectPath.split("/").some((part) => !part || part === "." || part === "..")
  ) {
    throw new Error("Invalid public tip cover object path.");
  }
  const searchPath = process.env.PUBLIC_OBJECT_SEARCH_PATHS
    ?.split(",")
    .map((entry) => entry.trim())
    .find(Boolean);
  if (!searchPath) {
    throw new Error("PUBLIC_OBJECT_SEARCH_PATHS is not configured.");
  }

  const normalized = searchPath.startsWith("/") ? searchPath : `/${searchPath}`;
  const [bucketName, ...prefixParts] = normalized.slice(1).split("/");
  if (!bucketName) {
    throw new Error("The first public object search path has no bucket name.");
  }
  const objectName = [...prefixParts, objectPath].filter(Boolean).join("/");
  if (!objectName) {
    throw new Error("The first public object search path has no object prefix.");
  }
  return objectStorageClient.bucket(bucketName).file(objectName);
}

export async function verifyManifestObject(
  entry: TipCoverManifestEntry,
): Promise<boolean> {
  const file = getPublicObjectFile(entry.objectPath);
  const [exists] = await file.exists();
  if (!exists) {
    return false;
  }

  const [metadata] = await file.getMetadata();
  if (Number(metadata.size) !== entry.bytes) {
    return false;
  }
  const storedHash = metadata.metadata?.tipCoverSha256;
  if (storedHash === entry.sha256) {
    return true;
  }
  const [bytes] = await file.download();
  return bytes.byteLength === entry.bytes && sha256(bytes) === entry.sha256;
}

export async function readTipCoverManifest(): Promise<TipCoverUploadManifest> {
  const manifest = JSON.parse(
    await readFile(tipCoverManifestPath, "utf8"),
  ) as Partial<TipCoverUploadManifest>;
  if (
    manifest.version !== 1 ||
    manifest.expectedCount !== EXPECTED_TIP_COVER_COUNT ||
    !Array.isArray(manifest.assets)
  ) {
    throw new Error("The local tip cover upload manifest is invalid.");
  }

  const seen = new Set<string>();
  for (const entry of manifest.assets) {
    if (
      !entry ||
      typeof entry.slug !== "string" ||
      typeof entry.objectPath !== "string" ||
      !Number.isSafeInteger(entry.bytes) ||
      entry.bytes <= 0 ||
      !/^[0-9a-f]{64}$/.test(entry.sha256) ||
      entry.objectPath !== `${TIP_COVER_PREFIX}/${entry.slug}.webp` ||
      seen.has(entry.slug)
    ) {
      throw new Error("The local tip cover upload manifest has an invalid entry.");
    }
    seen.add(entry.slug);
  }
  return manifest as TipCoverUploadManifest;
}

export async function writeTipCoverManifest(
  assets: TipCoverManifestEntry[],
): Promise<void> {
  await mkdir(path.dirname(tipCoverManifestPath), { recursive: true });
  const manifest: TipCoverUploadManifest = {
    version: 1,
    expectedCount: EXPECTED_TIP_COVER_COUNT,
    uploadedAt: new Date().toISOString(),
    assets: [...assets].sort((a, b) => a.slug.localeCompare(b.slug)),
  };
  const temporaryPath = `${tipCoverManifestPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await rename(temporaryPath, tipCoverManifestPath);
}

export function sha256(bytes: Buffer | Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}