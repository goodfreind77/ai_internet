import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { adminAccountsTable, db } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();
const scrypt = promisify(scryptCallback);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin1234";
const SECRET_KEY = process.env.TOKEN_SECRET ?? "internet-gift-secret-2026";
const ALL_PERMISSIONS = ["consultations", "applications", "content"] as const;
type AdminPermission = typeof ALL_PERMISSIONS[number];

export type AdminContext = {
  kind: "owner" | "account";
  id?: number;
  username: string;
  displayName: string;
  role: "full" | "limited";
  permissions: AdminPermission[];
};

declare global {
  namespace Express {
    interface Request {
      admin?: AdminContext;
    }
  }
}

function makeToken(password: string): string {
  return createHmac("sha256", SECRET_KEY).update(password).digest("hex");
}

const VALID_TOKEN = makeToken(ADMIN_PASSWORD);

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function encodeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", SECRET_KEY).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyJwt(token: string): { adminId: number } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expected = createHmac("sha256", SECRET_KEY).update(`${header}.${body}`).digest("base64url");
  if (!safeEqual(signature, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { adminId?: unknown; exp?: unknown };
    if (!Number.isInteger(payload.adminId) || (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000))) return null;
    return { adminId: payload.adminId as number };
  } catch {
    return null;
  }
}

function parsePermissions(value: string): AdminPermission[] {
  try {
    const permissions = JSON.parse(value);
    return Array.isArray(permissions)
      ? permissions.filter((permission): permission is AdminPermission => typeof permission === "string" && ALL_PERMISSIONS.includes(permission as AdminPermission))
      : [];
  } catch {
    return [];
  }
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const derived = await scrypt(password, salt, 64) as Buffer;
  return `${salt}:${derived.toString("base64url")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = await scrypt(password, salt, 64) as Buffer;
  return safeEqual(derived.toString("base64url"), hash);
}

function accountResponse(account: typeof adminAccountsTable.$inferSelect) {
  return {
    id: account.id,
    username: account.username,
    displayName: account.displayName,
    role: account.role,
    permissions: parsePermissions(account.permissions),
    isActive: account.isActive,
    lastLoginAt: account.lastLoginAt,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

function ownerContext(): AdminContext {
  return { kind: "owner", username: "owner", displayName: "소유자", role: "full", permissions: [...ALL_PERMISSIONS] };
}

export async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "인증이 필요합니다." });
    return;
  }
  const token = auth.slice(7);
  if (safeEqual(token, VALID_TOKEN)) {
    req.admin = ownerContext();
    next();
    return;
  }
  const payload = verifyJwt(token);
  if (!payload) {
    res.status(401).json({ error: "유효하지 않은 토큰입니다." });
    return;
  }
  try {
    const [account] = await db.select().from(adminAccountsTable).where(eq(adminAccountsTable.id, payload.adminId));
    if (!account || !account.isActive) {
      res.status(401).json({ error: "비활성화되었거나 삭제된 관리자 계정입니다." });
      return;
    }
    const role = account.role === "full" ? "full" : "limited";
    req.admin = {
      kind: "account",
      id: account.id,
      username: account.username,
      displayName: account.displayName,
      role,
      permissions: parsePermissions(account.permissions),
    };
    next();
  } catch (error) {
    req.log.error(error);
    res.status(500).json({ error: "관리자 인증 중 서버 오류가 발생했습니다." });
  }
}

export function requirePermission(permission: AdminPermission) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) return void res.status(401).json({ error: "인증이 필요합니다." });
    if (req.admin.kind === "owner" || req.admin.role === "full" || req.admin.permissions.includes(permission)) return next();
    res.status(403).json({ error: "이 작업을 수행할 권한이 없습니다." });
  };
}

export function requireFullAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.admin) return void res.status(401).json({ error: "인증이 필요합니다." });
  if (req.admin.kind === "owner" || req.admin.role === "full") return next();
  res.status(403).json({ error: "전체 관리자 권한이 필요합니다." });
}

function parseAccountInput(body: unknown, isPatch: boolean): { username?: string; displayName?: string; password?: string; role?: "full" | "limited"; permissions?: AdminPermission[]; isActive?: boolean } | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  if (!isPatch || "username" in input) {
    if (typeof input.username !== "string" || !/^[a-z0-9_-]{3,30}$/.test(input.username)) return null;
    result.username = input.username;
  }
  if (!isPatch || "displayName" in input) {
    if (typeof input.displayName !== "string" || !input.displayName.trim() || input.displayName.trim().length > 100) return null;
    result.displayName = input.displayName.trim();
  }
  if (!isPatch || "password" in input) {
    if (typeof input.password !== "string" || input.password.length < 8) return null;
    result.password = input.password;
  }
  if (!isPatch || "role" in input) {
    if (input.role !== "full" && input.role !== "limited") return null;
    result.role = input.role;
  }
  if (!isPatch || "permissions" in input) {
    if (!Array.isArray(input.permissions) || !input.permissions.every((permission) => typeof permission === "string" && ALL_PERMISSIONS.includes(permission as AdminPermission))) return null;
    result.permissions = [...new Set(input.permissions)] as AdminPermission[];
  }
  if ("isActive" in input) {
    if (typeof input.isActive !== "boolean") return null;
    result.isActive = input.isActive;
  }
  return result;
}

router.post("/admin/login", async (req: Request, res: Response) => {
  const { username, password } = req.body ?? {};
  if (typeof password !== "string" || !password) return void res.status(400).json({ error: "비밀번호를 입력해주세요." });
  if (username === undefined) {
    if (!safeEqual(makeToken(password), VALID_TOKEN)) return void res.status(401).json({ error: "비밀번호가 올바르지 않습니다." });
    return void res.json({ token: VALID_TOKEN, admin: ownerContext() });
  }
  if (typeof username !== "string") return void res.status(400).json({ error: "아이디를 올바르게 입력해주세요." });
  try {
    const [account] = await db.select().from(adminAccountsTable).where(eq(adminAccountsTable.username, username));
    if (!account || !account.isActive || !(await verifyPassword(password, account.passwordHash))) {
      return void res.status(401).json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }
    await db.update(adminAccountsTable).set({ lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(adminAccountsTable.id, account.id));
    const token = encodeJwt({ adminId: account.id, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 });
    res.json({ token, admin: accountResponse({ ...account, lastLoginAt: new Date(), updatedAt: new Date() }) });
  } catch (error) {
    req.log.error(error);
    res.status(500).json({ error: "로그인 처리 중 서버 오류가 발생했습니다." });
  }
});

router.get("/admin/me", adminAuthMiddleware, (req, res) => res.json(req.admin));
router.get("/admin/accounts", adminAuthMiddleware, requireFullAdmin, async (req, res) => {
  try {
    const accounts = await db.select().from(adminAccountsTable);
    res.json(accounts.map(accountResponse));
  } catch (error) { req.log.error(error); res.status(500).json({ error: "관리자 목록을 불러오지 못했습니다." }); }
});
router.post("/admin/accounts", adminAuthMiddleware, requireFullAdmin, async (req, res) => {
  const input = parseAccountInput(req.body, false);
  if (!input) return void res.status(400).json({ error: "관리자 정보가 올바르지 않습니다. 아이디는 3~30자의 영문 소문자, 숫자, _, -만 가능하며 비밀번호는 8자 이상이어야 합니다." });
  try {
    const [account] = await db.insert(adminAccountsTable).values({ username: input.username!, displayName: input.displayName!, passwordHash: await hashPassword(input.password!), role: input.role!, permissions: JSON.stringify(input.permissions!) }).returning();
    res.status(201).json(accountResponse(account));
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") return void res.status(409).json({ error: "이미 사용 중인 아이디입니다." });
    req.log.error(error); res.status(500).json({ error: "관리자 계정을 생성하지 못했습니다." });
  }
});
router.patch("/admin/accounts/:id", adminAuthMiddleware, requireFullAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const input = parseAccountInput(req.body, true);
  if (!Number.isInteger(id) || id < 1 || !input || Object.keys(input).length === 0) return void res.status(400).json({ error: "수정할 관리자 정보가 올바르지 않습니다." });
  if (req.admin?.kind === "account" && req.admin.id === id && input.isActive === false) return void res.status(400).json({ error: "자신의 계정은 비활성화할 수 없습니다." });
  try {
    const values: Record<string, unknown> = { ...input, updatedAt: new Date() };
    if (input.password) { values.passwordHash = await hashPassword(input.password); delete values.password; }
    if (input.permissions) values.permissions = JSON.stringify(input.permissions);
    const [account] = await db.update(adminAccountsTable).set(values).where(eq(adminAccountsTable.id, id)).returning();
    if (!account) return void res.status(404).json({ error: "관리자 계정을 찾을 수 없습니다." });
    res.json(accountResponse(account));
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") return void res.status(409).json({ error: "이미 사용 중인 아이디입니다." });
    req.log.error(error); res.status(500).json({ error: "관리자 계정을 수정하지 못했습니다." });
  }
});
router.delete("/admin/accounts/:id", adminAuthMiddleware, requireFullAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return void res.status(400).json({ error: "올바른 관리자 ID가 필요합니다." });
  if (req.admin?.kind === "account" && req.admin.id === id) return void res.status(400).json({ error: "자신의 계정은 삭제할 수 없습니다." });
  try {
    const [account] = await db.delete(adminAccountsTable).where(eq(adminAccountsTable.id, id)).returning();
    if (!account) return void res.status(404).json({ error: "관리자 계정을 찾을 수 없습니다." });
    res.json(accountResponse(account));
  } catch (error) { req.log.error(error); res.status(500).json({ error: "관리자 계정을 삭제하지 못했습니다." }); }
});

export default router;