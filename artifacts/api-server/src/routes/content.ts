import { Router, type IRouter, type Request, type Response } from "express";
import {
  adminResourcesTable,
  db,
  managedReviewsTable,
  managedTipsTable,
} from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { adminAuthMiddleware, requirePermission } from "./admin";

const router: IRouter = Router();

type ContentKind = "resource" | "review" | "tip";

const configurations: Record<ContentKind, {
  required: Record<string, string>;
  optionalText: string[];
  booleans: Record<string, string>;
  hasViews?: boolean;
}> = {
  resource: {
    required: { title: "제목", category: "카테고리", description: "설명", fileUrl: "파일 URL" },
    optionalText: ["previewUrl"],
    booleans: { isPublished: "공개 여부" },
  },
  review: {
    required: { title: "제목", author: "작성자", content: "내용" },
    optionalText: ["thumbnail"],
    booleans: { isBest: "베스트 여부", isPublished: "공개 여부" },
    hasViews: true,
  },
  tip: {
    required: { title: "제목", slug: "슬러그", category: "카테고리", content: "내용" },
    optionalText: ["thumbnail"],
    booleans: { isFeatured: "추천 여부", isPublished: "공개 여부" },
    hasViews: true,
  },
};

function parseId(req: Request, res: Response): number | null {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "올바른 항목 ID가 필요합니다." });
    return null;
  }
  return id;
}

function parseBody(kind: ContentKind, body: unknown, isPatch: boolean, res: Response): Record<string, unknown> | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    res.status(400).json({ error: "입력값이 올바르지 않습니다." });
    return null;
  }
  const config = configurations[kind];
  const input = body as Record<string, unknown>;
  const allowed = new Set([
    ...Object.keys(config.required), ...config.optionalText,
    ...Object.keys(config.booleans), ...(config.hasViews ? ["views"] : []),
  ]);
  const data: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(input)) {
    if (!allowed.has(field)) continue;
    if (field in config.required) {
      if (typeof value !== "string" || !value.trim()) {
        res.status(400).json({ error: `${config.required[field]}을(를) 입력해주세요.` });
        return null;
      }
      data[field] = value.trim();
    } else if (config.optionalText.includes(field)) {
      if (value === null || (typeof value === "string" && !value.trim())) {
        data[field] = null;
      } else if (typeof value !== "string") {
        res.status(400).json({ error: `${field === "thumbnail" ? "썸네일" : "미리보기 URL"}이(가) 올바르지 않습니다.` });
        return null;
      } else {
        data[field] = value.trim();
      }
    } else if (field in config.booleans) {
      if (typeof value !== "boolean") {
        res.status(400).json({ error: `${config.booleans[field]}는 true 또는 false여야 합니다.` });
        return null;
      }
      data[field] = value;
    } else if (field === "views") {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
        res.status(400).json({ error: "조회수는 0 이상의 정수여야 합니다." });
        return null;
      }
      data.views = value;
    }
  }
  if (!isPatch) {
    for (const [field, label] of Object.entries(config.required)) {
      if (!(field in data)) {
        res.status(400).json({ error: `${label}을(를) 입력해주세요.` });
        return null;
      }
    }
  }
  if (kind === "tip" && "slug" in data && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(data.slug))) {
    res.status(400).json({ error: "슬러그는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다." });
    return null;
  }
  if (isPatch && Object.keys(data).length === 0) {
    res.status(400).json({ error: "수정할 항목을 입력해주세요." });
    return null;
  }
  return data;
}

function handleError(req: Request, res: Response, err: unknown): void {
  req.log.error(err);
  if (typeof err === "object" && err !== null && "code" in err && err.code === "23505") {
    res.status(409).json({ error: "이미 사용 중인 슬러그입니다." });
    return;
  }
  res.status(500).json({ error: "서버 오류가 발생했습니다." });
}

router.get("/resources", async (req, res) => {
  try {
    res.json(await db.select().from(adminResourcesTable).where(eq(adminResourcesTable.isPublished, true)).orderBy(desc(adminResourcesTable.createdAt)));
  } catch (err) { handleError(req, res, err); }
});

router.get("/reviews", async (req, res) => {
  try {
    res.json(await db.select().from(managedReviewsTable).where(eq(managedReviewsTable.isPublished, true)).orderBy(desc(managedReviewsTable.createdAt)));
  } catch (err) { handleError(req, res, err); }
});

router.get("/reviews/:id", async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  try {
    const [review] = await db.select().from(managedReviewsTable)
      .where(and(eq(managedReviewsTable.id, id), eq(managedReviewsTable.isPublished, true)));
    if (!review) return void res.status(404).json({ error: "후기를 찾을 수 없습니다." });
    res.json(review);
  } catch (err) { handleError(req, res, err); }
});

router.get("/tips", async (req, res) => {
  try {
    res.json(await db.select().from(managedTipsTable).where(eq(managedTipsTable.isPublished, true)).orderBy(desc(managedTipsTable.createdAt)));
  } catch (err) { handleError(req, res, err); }
});

router.get("/tips/:slug", async (req, res) => {
  try {
    const [tip] = await db.select().from(managedTipsTable)
      .where(and(eq(managedTipsTable.slug, req.params.slug), eq(managedTipsTable.isPublished, true)));
    if (!tip) return void res.status(404).json({ error: "팁을 찾을 수 없습니다." });
    res.json(tip);
  } catch (err) { handleError(req, res, err); }
});

function mountCrud(
  path: string,
  table: any,
  kind: ContentKind,
) {
  router.get(`/admin/${path}`, adminAuthMiddleware, requirePermission("content"), async (req, res) => {
    try { res.json(await db.select().from(table).orderBy(desc(table.createdAt))); }
    catch (err) { handleError(req, res, err); }
  });
  router.post(`/admin/${path}`, adminAuthMiddleware, requirePermission("content"), async (req, res) => {
    const data = parseBody(kind, req.body, false, res);
    if (!data) return;
    try {
      const created = await db.insert(table).values(data).returning() as any[];
      res.status(201).json(created[0]);
    }
    catch (err) { handleError(req, res, err); }
  });
  router.patch(`/admin/${path}/:id`, adminAuthMiddleware, requirePermission("content"), async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;
    const data = parseBody(kind, req.body, true, res);
    if (!data) return;
    try {
      const [updated] = await db.update(table).set({ ...data, updatedAt: new Date() }).where(eq(table.id, id)).returning();
      if (!updated) return void res.status(404).json({ error: "항목을 찾을 수 없습니다." });
      res.json(updated);
    } catch (err) { handleError(req, res, err); }
  });
  router.delete(`/admin/${path}/:id`, adminAuthMiddleware, requirePermission("content"), async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const deletedRows = await db.delete(table).where(eq(table.id, id)).returning() as any[];
      const [deleted] = deletedRows;
      if (!deleted) return void res.status(404).json({ error: "항목을 찾을 수 없습니다." });
      res.json(deleted);
    } catch (err) { handleError(req, res, err); }
  });
}

mountCrud("resources", adminResourcesTable, "resource");
mountCrud("reviews", managedReviewsTable, "review");
mountCrud("tips", managedTipsTable, "tip");

export default router;