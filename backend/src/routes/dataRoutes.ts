import { Router } from "express";
import { importDataHandler } from "../controllers/dataController";

export const router = Router();

router.post("/data/import", importDataHandler);
