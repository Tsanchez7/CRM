import { Router } from "express";
import { getKpisHandler } from "../controllers/kpiController";

export const router = Router();

router.get("/kpis", getKpisHandler);
