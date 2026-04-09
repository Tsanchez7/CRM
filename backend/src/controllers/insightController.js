const { getKpis } = require("../services/kpiService");
const { generateInsightsFromKpis } = require("../services/insightService");
const { getWorkflowInsights } = require("../services/workflowService");

function getConfig() {
  const threshold = Number(process.env.CONVERSION_RATE_THRESHOLD ?? "0.2");
  return {
    conversionRateThreshold: Number.isFinite(threshold) ? threshold : 0.2,
  };
}

async function getInsightsHandler(req, res, next) {
  try {
    const kpis = await getKpis();
    const { conversionRateThreshold } = getConfig();
    const generated = generateInsightsFromKpis(kpis, { conversionRateThreshold });
    const workflow = getWorkflowInsights();

    // return newest first
    const insights = [...workflow, ...generated].sort((a, b) => {
      const ad = new Date(a.createdAt).getTime();
      const bd = new Date(b.createdAt).getTime();
      return bd - ad;
    });

    res.json({ generatedAt: new Date().toISOString(), insights });
  } catch (err) {
    next(err);
  }
}

module.exports = { getInsightsHandler };
