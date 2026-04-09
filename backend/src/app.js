const express = require("express");
const cors = require("cors");

const { router: apiRouter } = require("./routes");
const { initWorkflow } = require("./services/workflowService");

function getConfig() {
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
  const threshold = Number(process.env.CONVERSION_RATE_THRESHOLD ?? "0.2");

  return {
    corsOrigin,
    conversionRateThreshold: Number.isFinite(threshold) ? threshold : 0.2,
  };
}

function createApp() {
  const app = express();
  const config = getConfig();

  // init workflow once on boot
  initWorkflow({ conversionRateThreshold: config.conversionRateThreshold });

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));

  app.use(apiRouter);

  // Not found
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.statusCode || err.status || 500;
    res.status(status).json({
      error: "Internal Server Error",
      message: err.message,
    });
  });

  return app;
}

module.exports = { createApp };
