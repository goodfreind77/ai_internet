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
    const id = parseInt(String(req.params.id), 10);
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
    const id = parseInt(String(req.params.id), 10);
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
    const id = parseInt(String(req.params.id), 10);
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
    const id = parseInt(String(req.params.id), 10);
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
    const id = parseInt(String(req.params.id), 10);
    const idx = parseInt(String(req.params.index), 10);
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

router.get("/consent/:id", async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const [app] = await db
      .select({
        id: applicationsTable.id,
        name: applicationsTable.name,
        phone: applicationsTable.phone,
        consentedAt: applicationsTable.consentedAt,
      })
      .from(applicationsTable)
      .where(eq(applicationsTable.id, id));
    if (!app) {
      res.status(404).json({ error: "동의서를 찾을 수 없습니다." });
      return;
    }
    res.json(app);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.post("/consent/:id/agree", async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { confirmation } = req.body;
    if (confirmation !== "동의합니다.") {
      res.status(400).json({ error: "'동의합니다.'를 정확히 입력해주세요." });
      return;
    }
    const [current] = await db
      .select({ consentedAt: applicationsTable.consentedAt })
      .from(applicationsTable)
      .where(eq(applicationsTable.id, id));
    if (!current) {
      res.status(404).json({ error: "동의서를 찾을 수 없습니다." });
      return;
    }
    if (current.consentedAt) {
      res.status(409).json({ error: "이미 동의가 완료된 동의서입니다." });
      return;
    }
    const [updated] = await db
      .update(applicationsTable)
      .set({ consentedAt: new Date() })
      .where(eq(applicationsTable.id, id))
      .returning({
        id: applicationsTable.id,
        name: applicationsTable.name,
        phone: applicationsTable.phone,
        consentedAt: applicationsTable.consentedAt,
      });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.post("/applications/:id/notify", adminAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { link, message } = req.body;

    const [app] = await db
      .select({ phone: applicationsTable.phone, name: applicationsTable.name })
      .from(applicationsTable)
      .where(eq(applicationsTable.id, id));

    if (!app) {
      res.status(404).json({ error: "항목을 찾을 수 없습니다." });
      return;
    }
    if (!app.phone) {
      res.status(400).json({ error: "휴대폰 번호가 없습니다." });
      return;
    }

    const KAKAO_API_KEY = process.env.KAKAO_API_KEY;
    const KAKAO_SENDER_KEY = process.env.KAKAO_SENDER_KEY;
    const KAKAO_TEMPLATE_CODE = process.env.KAKAO_TEMPLATE_CODE;

    if (!KAKAO_API_KEY || !KAKAO_SENDER_KEY || !KAKAO_TEMPLATE_CODE) {
      req.log.warn({ id, phone: app.phone, link, message }, "카카오 알림톡 API 키 미설정 — 실제 발송 생략 (mock)");
      res.json({
        mock: true,
        message: "카카오 API 키가 설정되지 않아 실제 발송은 생략됩니다.",
        to: app.phone,
        name: app.name,
        link,
        body: message,
      });
      return;
    }

    const phoneNormalized = app.phone.replace(/-/g, "");

    const payload = {
      message: {
        to: phoneNormalized,
      },
      kakaoOptions: {
        senderKey: KAKAO_SENDER_KEY,
        templateCode: KAKAO_TEMPLATE_CODE,
        variables: {
          "#{이름}": app.name ?? "고객",
          "#{링크}": link ?? "",
          "#{내용}": message ?? "",
        },
      },
    };

    const kakaoRes = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KAKAO_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!kakaoRes.ok) {
      const errBody = await kakaoRes.text();
      req.log.error({ status: kakaoRes.status, body: errBody }, "카카오 알림톡 발송 실패");
      res.status(502).json({ error: "알림톡 발송에 실패했습니다.", detail: errBody });
      return;
    }

    const result = await kakaoRes.json();
    req.log.info({ id, phone: phoneNormalized, result }, "카카오 알림톡 발송 성공");
    res.json({ success: true, result });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
