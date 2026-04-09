function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function pct(value) {
  return Math.round(value * 1000) / 10; // 1 decimal
}

function generateInsightsFromKpis(kpis, { conversionRateThreshold }) {
  const insights = [];

  const conversionRate = toNumber(kpis?.conversionRate, 0);
  if (conversionRate < conversionRateThreshold) {
    insights.push({
      id: `insight-conversion-${kpis.generatedAt}`,
      type: "ALERT",
      title: "Conversión por debajo del umbral",
      message: `La tasa de conversión (${pct(conversionRate)}%) está por debajo del umbral (${pct(conversionRateThreshold)}%).`,
      createdAt: kpis.generatedAt,
      meta: { conversionRate, conversionRateThreshold },
    });
  }

  const last30 = toNumber(kpis?.revenue?.last30Days, 0);
  const prev30 = toNumber(kpis?.revenue?.previous30Days, 0);
  if (prev30 > 0 && last30 < prev30) {
    const drop = (prev30 - last30) / prev30;
    insights.push({
      id: `insight-revenue-drop-${kpis.generatedAt}`,
      type: "INFO",
      title: "Caída de revenue (30 días)",
      message: `El revenue de los últimos 30 días cayó ${pct(drop)}% vs el período anterior.`,
      createdAt: kpis.generatedAt,
      meta: { last30Days: last30, previous30Days: prev30, drop },
    });
  }

  const opps = kpis?.opportunitiesByStage ?? {};
  const totalOpps = toNumber(kpis?.opportunitiesCount, 0);
  const lost = toNumber(opps.lost, 0);
  if (totalOpps >= 10 && lost / totalOpps > 0.5) {
    insights.push({
      id: `insight-loss-rate-${kpis.generatedAt}`,
      type: "INFO",
      title: "Alto porcentaje de oportunidades perdidas",
      message: `Más del 50% de oportunidades están en estado LOST (${lost}/${totalOpps}).`,
      createdAt: kpis.generatedAt,
      meta: { lost, totalOpps },
    });
  }

  return insights;
}

module.exports = { generateInsightsFromKpis };
