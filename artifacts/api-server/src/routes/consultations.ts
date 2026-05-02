import { Router, type IRouter } from "express";
import { db, consultationRequestsTable, applicationsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

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

router.get("/consultations", async (req, res) => {
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

router.get("/applications", async (req, res) => {
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

export default router;
