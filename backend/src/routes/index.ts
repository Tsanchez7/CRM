import { Router } from "express";
import { router as kpiRoutes } from "./kpiRoutes";
import { router as insightRoutes } from "./insightRoutes";
import { router as dataRoutes } from "./dataRoutes";

export const router = Router();

router.use(kpiRoutes);
router.use(insightRoutes);
router.use(dataRoutes);
