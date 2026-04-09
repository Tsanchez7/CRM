type Kpis = {
  generatedAt: string;
  conversionRate: number;
  revenue: { last30Days: number; previous30Days: number };
  opportunitiesByStage: { lost: number };
  opportunitiesCount: number;
};

export type InsightSourceLiteral = "RULE" | "WORKFLOW";

export type InsightUpsertInput = {
  source: InsightSourceLiteral;
  kind: string;
  type: string;
  title: string;
  message: string;
  meta?: unknown;
  kpiSnapshotAt: Date;
  createdAt: Date;
};

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function pct(value: number): number {
  return Math.round(value * 1000) / 10; // 1 decimal
}

export function generateInsightsFromKpis(
  kpis: Kpis,
  { conversionRateThreshold }: { conversionRateThreshold: number },
): InsightUpsertInput[] {
  const insights: InsightUpsertInput[] = [];
  const kpiSnapshotAt = kpis?.generatedAt ? new Date(kpis.generatedAt) : new Date();

  const conversionRate = toNumber(kpis?.conversionRate, 0);
  if (conversionRate < conversionRateThreshold) {
    insights.push({
      source: "RULE",
      kind: "CONVERSION_BELOW_THRESHOLD",
      type: "ALERT",
      title: "Conversión por debajo del umbral",
      message: `La tasa de conversión (${pct(conversionRate)}%) está por debajo del umbral (${pct(conversionRateThreshold)}%).`,
      createdAt: kpiSnapshotAt,
      kpiSnapshotAt,
      meta: { conversionRate, conversionRateThreshold },
    });
  }

  const last30 = toNumber(kpis?.revenue?.last30Days, 0);
  const prev30 = toNumber(kpis?.revenue?.previous30Days, 0);
  if (prev30 > 0 && last30 < prev30) {
    const drop = (prev30 - last30) / prev30;
    insights.push({
      source: "RULE",
      kind: "REVENUE_DROP_30D",
      type: "INFO",
      title: "Caída de revenue (30 días)",
      message: `El revenue de los últimos 30 días cayó ${pct(drop)}% vs el período anterior.`,
      createdAt: kpiSnapshotAt,
      kpiSnapshotAt,
      meta: { last30Days: last30, previous30Days: prev30, drop },
    });
  }

  const totalOpps = toNumber(kpis?.opportunitiesCount, 0);
  const lost = toNumber(kpis?.opportunitiesByStage?.lost, 0);
  if (totalOpps >= 10 && lost / totalOpps > 0.5) {
    insights.push({
      source: "RULE",
      kind: "HIGH_LOSS_RATE",
      type: "INFO",
      title: "Alto porcentaje de oportunidades perdidas",
      message: `Más del 50% de oportunidades están en estado LOST (${lost}/${totalOpps}).`,
      createdAt: kpiSnapshotAt,
      kpiSnapshotAt,
      meta: { lost, totalOpps },
    });
  }

  return insights;
}
