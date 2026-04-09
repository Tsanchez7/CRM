import type { Request, Response, NextFunction } from "express";
import { listInsights } from "../services/insightStoreService";

export async function getInsightsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const insights = await listInsights({ limit: req.query.limit });
    res.json({ generatedAt: new Date().toISOString(), insights });
  } catch (err) {
    next(err);
  }
}
