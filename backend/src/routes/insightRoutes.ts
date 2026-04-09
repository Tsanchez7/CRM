import { Router } from "express";
import { getInsightsHandler } from "../controllers/insightController";

export const router = Router();

router.get("/insights", getInsightsHandler);
