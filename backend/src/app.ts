import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";

import { router as apiRouter } from "./routes";
import { initWorkflow } from "./services/workflowService";

function getConfig() {
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
  const threshold = Number(process.env.CONVERSION_RATE_THRESHOLD ?? "0.2");

  return {
    corsOrigin,
    conversionRateThreshold: Number.isFinite(threshold) ? threshold : 0.2,
  };
}

export function createApp() {
  const app = express();
  const config = getConfig();

  initWorkflow({ conversionRateThreshold: config.conversionRateThreshold });

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));

  app.use(apiRouter);

  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Not Found" });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    const anyErr = err as { statusCode?: number; status?: number; message?: string };
    const status = anyErr.statusCode || anyErr.status || 500;
    res.status(status).json({
      error: "Internal Server Error",
      message: anyErr.message || "Unknown error",
    });
  });

  return app;
}
