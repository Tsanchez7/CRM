const { listInsights } = require("../services/insightStoreService");

async function getInsightsHandler(req, res, next) {
  try {
    const limit = req.query.limit;
    const insights = await listInsights({ limit });
    res.json({ generatedAt: new Date().toISOString(), insights });
  } catch (err) {
    next(err);
  }
}

module.exports = { getInsightsHandler };
