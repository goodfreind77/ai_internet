import { Router, type IRouter } from "express";
import healthRouter from "./health";
import consultationsRouter from "./consultations";
import contentRouter from "./content";
import adminRouter from "./admin";
import landingPagesRouter from "./landing-pages";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(consultationsRouter);
router.use(contentRouter);
router.use(landingPagesRouter);
router.use(storageRouter);

export default router;
