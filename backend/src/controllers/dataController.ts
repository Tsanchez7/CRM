import type { Request, Response, NextFunction } from "express";
import { importData } from "../services/dataImportService";

export async function importDataHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await importData(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
