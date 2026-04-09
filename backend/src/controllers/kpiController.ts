import type { Request, Response, NextFunction } from "express";
import { getKpis } from "../services/kpiService";

export async function getKpisHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const kpis = await getKpis();
    res.json(kpis);
  } catch (err) {
    next(err);
  }
}
