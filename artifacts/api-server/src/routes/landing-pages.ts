import { Router, type IRouter } from "express";
import { db, landingPagesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { adminAuthMiddleware, requirePermission } from "./admin";

const router: IRouter = Router();

const safeLink = (value: string) =>
  (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) ||
  /^https:\/\/[^\s/]+\.[^\s/]+(?:[/?#][^\s]*)?$/i.test(value);

type PageInput = {
  title: string; slug: string; category: string; eyebrow: string; headline: string;
  description: string; benefits: string; ctaLabel: string; ctaUrl: string;
  imageUrl: string | null; isPublished: boolean;
};
const textLimits: Record<Exclude<keyof PageInput, "imageUrl" | "isPublished">, number> = {
  title: 200, slug: 100, category: 30, eyebrow: 120, headline: 200,
  description: 10000, benefits: 10000, ctaLabel: 100, ctaUrl: 2000,
};
const required = ["title", "slug", "category", "headline", "ctaLabel", "ctaUrl"];
function parsePageInput(body: unknown, partial = false): Partial<PageInput> | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  const keys = Object.keys(input);
  if (!keys.length || keys.some(key => !(key in textLimits) && key !== "imageUrl" && key !== "isPublished")) return null;
  if (!partial && (Object.keys(textLimits).some(key => !(key in input)) || !("imageUrl" in input) || !("isPublished" in input))) return null;
  const parsed: Record<string, unknown> = {};
  for (const [key, limit] of Object.entries(textLimits)) {
    if (!(key in input)) continue;
    const value = input[key];
    if (typeof value !== "string" || value.trim().length > limit || (required.includes(key) && !value.trim())) return null;
    parsed[key] = value.trim();
  }
  if ("imageUrl" in input) {
    const url = input.imageUrl;
    if (url !== null && (typeof url !== "string" || (url.trim() !== "" && !safeLink(url.trim())) || url.length > 2000)) return null;
    parsed.imageUrl = typeof url === "string" ? url.trim() || null : null;
  }
  if ("isPublished" in input) {
    if (typeof input.isPublished !== "boolean") return null;
    parsed.isPublished = input.isPublished;
  }
  if ("slug" in parsed && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(parsed.slug))) return null;
  if ("category" in parsed && !["당근마켓", "구글광고", "일반/기타"].includes(String(parsed.category))) return null;
  if ("ctaUrl" in parsed && !safeLink(String(parsed.ctaUrl))) return null;
  return parsed as Partial<PageInput>;
}

function pageId(raw: string): number | null {
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function handleError(res: import("express").Response, req: import("express").Request, error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
    res.status(409).json({ error: "이미 사용 중인 주소입니다. 다른 주소를 입력해주세요." });
    return;
  }
  req.log.error(error);
  res.status(500).json({ error: "랜딩페이지 처리 중 오류가 발생했습니다." });
}

router.get("/landing-pages/:slug", async (req, res) => {
  try {
    const slug = String(req.params.slug);
    const [page] = await db.select().from(landingPagesTable).where(eq(landingPagesTable.slug, slug));
    if (!page?.isPublished) return void res.status(404).json({ error: "공개된 페이지를 찾을 수 없습니다." });
    res.setHeader("Cache-Control", "no-store");
    res.json(page);
  } catch (error) { handleError(res, req, error); }
});

router.get("/admin/landing-pages", adminAuthMiddleware, requirePermission("content"), async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    res.json(await db.select().from(landingPagesTable).orderBy(desc(landingPagesTable.createdAt)));
  } catch (error) { handleError(res, req, error); }
});

router.post("/admin/landing-pages", adminAuthMiddleware, requirePermission("content"), async (req, res) => {
  const parsed = parsePageInput(req.body);
  if (!parsed) return void res.status(400).json({ error: "입력값을 확인해주세요." });
  try {
    const [created] = await db.insert(landingPagesTable).values({
      ...parsed as PageInput,
    }).returning();
    res.status(201).json(created);
  } catch (error) { handleError(res, req, error); }
});

router.patch("/admin/landing-pages/:id", adminAuthMiddleware, requirePermission("content"), async (req, res) => {
  const id = pageId(String(req.params.id));
  if (!id) return void res.status(400).json({ error: "올바른 ID가 필요합니다." });
  const parsed = parsePageInput(req.body, true);
  if (!parsed) return void res.status(400).json({ error: "입력값을 확인해주세요." });
  try {
    const [updated] = await db.update(landingPagesTable)
      .set({ ...parsed, updatedAt: new Date() })
      .where(eq(landingPagesTable.id, id)).returning();
    if (!updated) return void res.status(404).json({ error: "페이지를 찾을 수 없습니다." });
    res.json(updated);
  } catch (error) { handleError(res, req, error); }
});

router.post("/admin/landing-pages/:id/duplicate", adminAuthMiddleware, requirePermission("content"), async (req, res) => {
  const id = pageId(String(req.params.id));
  if (!id) return void res.status(400).json({ error: "올바른 ID가 필요합니다." });
  try {
    const [page] = await db.select().from(landingPagesTable).where(eq(landingPagesTable.id, id));
    if (!page) return void res.status(404).json({ error: "페이지를 찾을 수 없습니다." });
    const { title, category, eyebrow, headline, description, benefits, ctaLabel, ctaUrl, imageUrl } = page;
    const [copy] = await db.insert(landingPagesTable).values({
      slug: `${page.slug.slice(0, 78)}-copy-${Date.now().toString(36)}`,
      title: `${title.slice(0, 193)} (복제)`, category, eyebrow, headline, description, benefits, ctaLabel, ctaUrl, imageUrl,
      isPublished: false,
    }).returning();
    res.status(201).json(copy);
  } catch (error) { handleError(res, req, error); }
});

router.delete("/admin/landing-pages/:id", adminAuthMiddleware, requirePermission("content"), async (req, res) => {
  const id = pageId(String(req.params.id));
  if (!id) return void res.status(400).json({ error: "올바른 ID가 필요합니다." });
  try {
    const [removed] = await db.delete(landingPagesTable).where(eq(landingPagesTable.id, id)).returning({ id: landingPagesTable.id });
    if (!removed) return void res.status(404).json({ error: "페이지를 찾을 수 없습니다." });
    res.status(204).end();
  } catch (error) { handleError(res, req, error); }
});

export default router;