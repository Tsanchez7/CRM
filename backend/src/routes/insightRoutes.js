const express = require("express");
const { getInsightsHandler } = require("../controllers/insightController");

const router = express.Router();

router.get("/insights", getInsightsHandler);

module.exports = { router };
