import { Router, type IRouter } from "express";
import { db, consultationRequestsTable, applicationsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { adminAuthMiddleware } from "./admin";

const router: IRouter = Router();

const STATUSES = ["처리중", "접수완료", "취소"] as const;

router.post("/consultations", async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      res.status(400).json({ error: "이름과 연락처는 필수입니다." });
      return;
    }
    const [created] = await db
      .insert(consultationRequestsTable)
      .values({ name, phone })
      .returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.get("/consultations", adminAuthMiddleware, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(consultationRequestsTable)
      .orderBy(desc(consultationRequestsTable.createdAt));
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.patch("/consultations/:id/status", adminAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      res.status(400).json({ error: "유효하지 않은 상태입니다." });
      return;
    }
    const [updated] = await db
      .update(consultationRequestsTable)
      .set({ status })
      .where(eq(consultationRequestsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "항목을 찾을 수 없습니다." });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.post("/applications", async (req, res) => {
  try {
    const data = req.body;
    const [created] = await db
      .insert(applicationsTable)
      .values(data)
      .returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.get("/applications", adminAuthMiddleware, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(applicationsTable)
      .orderBy(desc(applicationsTable.createdAt));
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.patch("/applications/:id/status", adminAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      res.status(400).json({ error: "유효하지 않은 상태입니다." });
      return;
    }
    const [updated] = await db
      .update(applicationsTable)
      .set({ status })
      .where(eq(applicationsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "항목을 찾을 수 없습니다." });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.patch("/applications/:id/memo", adminAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { adminMemo } = req.body;
    const [updated] = await db
      .update(applicationsTable)
      .set({ adminMemo: adminMemo ?? null })
      .where(eq(applicationsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "항목을 찾을 수 없습니다." });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.post("/applications/:id/history", adminAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { note } = req.body;
    if (!note || !note.trim()) {
      res.status(400).json({ error: "상담 내용을 입력해주세요." });
      return;
    }
    const [current] = await db
      .select({ consultationHistory: applicationsTable.consultationHistory })
      .from(applicationsTable)
      .where(eq(applicationsTable.id, id));
    if (!current) {
      res.status(404).json({ error: "항목을 찾을 수 없습니다." });
      return;
    }
    type HistoryEntry = { date: string; note: string };
    const existing: HistoryEntry[] = current.consultationHistory
      ? JSON.parse(current.consultationHistory)
      : [];
    const newEntry: HistoryEntry = { date: new Date().toISOString(), note: note.trim() };
    const updated_history = JSON.stringify([...existing, newEntry]);
    const [updated] = await db
      .update(applicationsTable)
      .set({ consultationHistory: updated_history })
      .where(eq(applicationsTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.delete("/applications/:id/history/:index", adminAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const idx = parseInt(req.params.index, 10);
    const [current] = await db
      .select({ consultationHistory: applicationsTable.consultationHistory })
      .from(applicationsTable)
      .where(eq(applicationsTable.id, id));
    if (!current) {
      res.status(404).json({ error: "항목을 찾을 수 없습니다." });
      return;
    }
    type HistoryEntry = { date: string; note: string };
    const existing: HistoryEntry[] = current.consultationHistory
      ? JSON.parse(current.consultationHistory)
      : [];
    existing.splice(idx, 1);
    const [updated] = await db
      .update(applicationsTable)
      .set({ consultationHistory: JSON.stringify(existing) })
      .where(eq(applicationsTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
