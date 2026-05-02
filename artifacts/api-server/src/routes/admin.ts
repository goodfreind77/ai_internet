import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { createHmac } from "crypto";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin1234";
const SECRET_KEY = process.env.TOKEN_SECRET ?? "internet-gift-secret-2026";

function makeToken(password: string): string {
  return createHmac("sha256", SECRET_KEY).update(password).digest("hex");
}

const VALID_TOKEN = makeToken(ADMIN_PASSWORD);

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "인증이 필요합니다." });
    return;
  }
  const token = auth.slice(7);
  if (token !== VALID_TOKEN) {
    res.status(401).json({ error: "유효하지 않은 토큰입니다." });
    return;
  }
  next();
}

router.post("/admin/login", (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: "비밀번호를 입력해주세요." });
    return;
  }
  if (makeToken(password) !== VALID_TOKEN) {
    res.status(401).json({ error: "비밀번호가 올바르지 않습니다." });
    return;
  }
  res.json({ token: VALID_TOKEN });
});

export default router;
