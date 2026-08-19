import { Router, type IRouter } from "express";
import { db, consultationRequestsTable, applicationsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { adminAuthMiddleware } from "./admin";
import { SolapiMessageService } from "solapi";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "node:url";

const router: IRouter = Router();
const consentPdfFontPath = fileURLToPath(
  new URL("./NanumGothicBold.ttf", import.meta.url),
);

function formatConsentDate(value: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch (_) {}
}

const STATUSES = ["처리중", "접수완료", "개통완료", "취소"] as const;

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
    sendTelegram(
      `📞 <b>빠른 견적 문의</b>\n👤 이름: ${name}\n📱 연락처: ${phone}\n🕐 시간: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`
    );
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
    const d = data as Record<string, string>;
    const v = (val: string | undefined) => val || "-";
    const lines = [
      `📋 <b>신청서 접수 #${created.id}</b>`,
      `🕐 ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
      ``,
      `<b>▶ 고객 정보</b>`,
      `👤 이름: ${v(d.name)}`,
      `📱 연락처: ${v(d.phone)}  (통신사: ${v(d.phoneCarrier)})`,
      `📧 이메일: ${v(d.email)}`,
      `🏠 주소: ${v(d.address)}`,
      ``,
      `<b>▶ 가입 정보</b>`,
      `🔄 현재 통신사: ${v(d.currentProvider)}`,
      `🌐 신청 통신사: ${v(d.applyProvider)}`,
      `📦 인터넷: ${v(d.internet)}`,
      `📺 TV: ${v(d.tv)}`,
      `👥 고객 유형: ${v(d.customerType)}`,
      ``,
      `<b>▶ 납부 정보</b>`,
      `💳 납부 방법: ${v(d.paymentMethod)}`,
      ...(d.paymentMethod === "계좌이체" ? [
        `🏦 납부 은행: ${v(d.payBank)}`,
        `💰 납부 계좌: ${v(d.payAccount)} (${v(d.payAccountHolder)})`,
      ] : []),
      ...(d.paymentMethod === "카드" ? [
        `🏦 카드사: ${v(d.cardCompany)}`,
        `💳 카드번호: ${v(d.cardNumber)}  만료: ${v(d.cardExpiry)}`,
      ] : []),
      ``,
      `<b>▶ 사은품 계좌</b>`,
      `🏦 ${v(d.giftBank)} / ${v(d.giftAccount)} (${v(d.giftAccountHolder)})`,
      ...(d.memo ? [``, `📝 메모: ${d.memo}`] : []),
    ];
    sendTelegram(lines.join("\n"));
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

    // 개통완료 상태로 변경 시 카카오 알림톡 자동 발송 (기존 동의서 템플릿 사용)
    if (status === "개통완료" && updated.phone) {
      const apiKey = process.env.SOLAPI_API_KEY;
      const apiSecret = process.env.SOLAPI_API_SECRET;
      const pfId = process.env.SOLAPI_KAKAO_PF_ID;
      const templateId = process.env.SOLAPI_KAKAO_TEMPLATE_ID;
      const from = process.env.SOLAPI_SENDER;

      if (apiKey && apiSecret && pfId && templateId && from) {
        try {
          const client = new SolapiMessageService(apiKey, apiSecret);
          const phoneNormalized = updated.phone.replace(/-/g, "");
          const consentUrl = `${process.env.REPLIT_DOMAINS?.split(",")[0] ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : ""}${
            process.env.BASE_PATH ?? ""
          }/consent/${id}`;
          await client.send({
            to: phoneNormalized,
            from,
            kakaoOptions: {
              pfId,
              templateId,
              variables: {
                "#{name}": updated.name ?? "고객",
                "#{agreement_api}": consentUrl,
              },
            },
          });
          req.log.info({ id, phone: phoneNormalized }, "개통완료 카카오 알림톡 발송 성공");
        } catch (notifyErr) {
          req.log.error({ id, notifyErr }, "개통완료 알림톡 발송 실패 (상태 변경은 완료)");
        }
      } else {
        req.log.warn({ id }, "Solapi 환경변수 미설정 — 개통완료 알림톡 생략");
      }
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

router.get("/consent/:id/pdf", adminAuthMiddleware, async (req, res) => {
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

    if (!app.consentedAt) {
      res.status(409).json({ error: "고객 동의가 완료된 후 저장할 수 있습니다." });
      return;
    }

    const fileName = `internet-gift-consent-${app.id}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Cache-Control", "private, no-store");

    const doc = new PDFDocument({
      size: "A4",
      margin: 48,
      info: {
        Title: "인터넷 가입 사은품 지급 및 반환 동의서",
        Author: "주식회사이좋은사람들 (AI인터넷.com)",
      },
    });

    doc.registerFont("NanumGothic", consentPdfFontPath);
    doc.font("NanumGothic");
    doc.pipe(res);

    const writeSection = (title: string, content: string[]) => {
      doc
        .fillColor("#111111")
        .fontSize(12)
        .text(title, { lineGap: 3 });
      doc.moveDown(0.25);
      content.forEach((line) => {
        doc
          .fillColor("#333333")
          .fontSize(9.5)
          .text(line, { indent: 8, lineGap: 3 });
        doc.moveDown(0.2);
      });
      doc.moveDown(0.65);
    };

    doc
      .fillColor("#666666")
      .fontSize(9)
      .text("주식회사이좋은사람들 (AI인터넷.com)", { align: "center" });
    doc
      .fillColor("#111111")
      .fontSize(19)
      .text("인터넷 가입 사은품 지급 및 반환 동의서", { align: "center" });
    doc.moveDown(1);

    doc
      .roundedRect(48, doc.y, 499, 78, 7)
      .fillAndStroke("#F8FAFC", "#D9E1EA");
    const infoTop = doc.y + 13;
    doc
      .fillColor("#666666")
      .fontSize(9)
      .text("고객명", 64, infoTop)
      .text("연락처", 64, infoTop + 20)
      .text("동의일시", 64, infoTop + 40);
    doc
      .fillColor("#111111")
      .fontSize(10)
      .text(app.name ?? "-", 140, infoTop)
      .text(app.phone ?? "-", 140, infoTop + 20)
      .text(formatConsentDate(app.consentedAt), 140, infoTop + 40);
    doc.y = infoTop + 75;
    doc.moveDown(1);

    doc
      .fillColor("#333333")
      .fontSize(10)
      .text(
        "주식회사이좋은사람들(AI인터넷.com)은 고객님의 통신 서비스 가입을 축하드리며, 사은품 지급과 관련하여 아래 내용에 대한 동의를 받고자 합니다. 아래 내용을 충분히 읽으신 후 동의해 주시기 바랍니다.",
        { lineGap: 4 },
      );
    doc.moveDown(1);

    writeSection("제1조 (사은품 지급 조건)", [
      "회사는 아래 두 가지 조건이 모두 충족된 경우에 한하여 고객님께 사은품을 현금으로 지급합니다.",
      "1호: 고객님이 가입하신 통신 서비스(인터넷, TV, 전화, CCTV 등 가입 상품 전체)의 정상 개통이 완료된 경우",
      "2호: 고객님의 본 동의서의 전체 항목에 동의한 경우",
      "사은품 금액은 가입하신 통신사, 가입 상품 구성 및 고객별 조건에 따라 전화 상담 시 약속된 금액으로 확정됩니다.",
    ]);

    writeSection("제2조 (사은품 반환 의무)", [
      "고객님은 가입 상품 개통 완료 처리일(개통일 당일 포함)로부터 1년(12개월) 이내에 아래 각 호에 해당하는 행위를 하는 경우, 지급받은 사은품 전액 또는 일부를 회사에 반환하여야 합니다.",
      "1호: 가입 상품(인터넷/TV/전화/CCTV 등) 중 1개 이상의 서비스 해지",
      "2호: 가입 상품 중 1개 이상의 서비스 일시정지",
      "3호: 가입 당시 계약한 상품의 임의 변경(상위 상품으로의 변경 제외)",
      "4호: 가입 상품 전체 또는 일부의 명의 변경(회사의 동의를 통해 명의변경 하는 경우 제외)",
      "가입 상품 일부만 해지·정지·변경하는 경우에도 사은품 전액 또는 일부 반환 의무가 동일하게 적용됩니다.",
      "반환 의무 기산일은 통신사 개통 완료 처리일을 기준으로 하며, 개통일 당일을 포함하여 산정합니다.",
    ]);

    writeSection("제3조 (반환 방법 및 기한)", [
      "사은품 반환은 고객님이 해지·정지·변경 신청을 한 즉시 회사가 지정하는 계좌로 현금 이체하는 방법으로 이루어집니다. 반환 계좌 정보는 반환 사유 발생 시 회사에서 별도 안내드립니다.",
    ]);

    writeSection("제4조 (반환 불이행 시 조치)", [
      "고객님이 정당한 사유 없이 사은품 반환을 거부하거나 기한 내 이행하지 않을 경우, 회사는 민사상 청구 등 법적 절차를 진행할 수 있습니다.",
    ]);

    writeSection("제5조 (개인정보 활용 동의)", [
      "본 동의서 작성 및 보관을 위해 고객님의 성명, 연락처, 가입 정보가 활용됩니다. 수집된 개인정보는 사은품 지급 및 반환 관리 목적으로만 사용되며, 관련 법령에 따라 보관됩니다.",
    ]);

    doc
      .roundedRect(48, doc.y, 499, 70, 7)
      .fillAndStroke("#F0F7FF", "#C3D9F0");
    const agreementTop = doc.y + 12;
    doc
      .fillColor("#1A5276")
      .fontSize(10)
      .text("전자 동의 완료", 64, agreementTop)
      .fillColor("#333333")
      .fontSize(9)
      .text(
        '위 서명자는 본 동의서의 전체 내용을 확인하고 "동의합니다."를 입력하여 전자적으로 동의하였습니다.',
        64,
        agreementTop + 20,
        { width: 466, lineGap: 3 },
      )
      .text(`동의일시: ${formatConsentDate(app.consentedAt)}`, 64, agreementTop + 42);
    doc.y = agreementTop + 75;
    doc.moveDown(1);
    doc
      .fillColor("#999999")
      .fontSize(8)
      .text(
        `© AI인터넷(ai인터넷.com) | 주식회사이좋은사람들 | 문서번호: CONSENT-${app.id}`,
        { align: "center" },
      );

    doc.end();
  } catch (err) {
    req.log.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: "PDF 생성 중 오류가 발생했습니다." });
    } else {
      res.end();
    }
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
    const { variables } = req.body as { variables?: Record<string, string> };

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

    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;
    const pfId = process.env.SOLAPI_KAKAO_PF_ID;
    const templateId = process.env.SOLAPI_KAKAO_TEMPLATE_ID;
    const from = process.env.SOLAPI_SENDER;

    if (!apiKey || !apiSecret || !pfId || !templateId || !from) {
      req.log.warn({ id }, "Solapi 환경변수 미설정 — mock 응답");
      res.json({
        mock: true,
        message: "Solapi 환경변수가 설정되지 않아 실제 발송은 생략됩니다.",
        to: app.phone,
        name: app.name,
      });
      return;
    }

    const phoneNormalized = app.phone.replace(/-/g, "");

    const client = new SolapiMessageService(apiKey, apiSecret);

    const consentUrl = `${process.env.REPLIT_DOMAINS?.split(",")[0] ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : ""}${
      process.env.BASE_PATH ?? ""
    }/consent/${id}`;

    const result = await client.send({
      to: phoneNormalized,
      from,
      kakaoOptions: {
        pfId,
        templateId,
        variables: {
          "#{name}": app.name ?? "고객",
          "#{agreement_api}": consentUrl,
          ...variables,
        },
      },
    });

    req.log.info({ id, phone: phoneNormalized, result }, "카카오 알림톡 발송 성공");
    res.json({ success: true, result });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
