import { prisma } from "../db/prisma";

type RevenueByDayPoint = { date: string; revenue: number };

type Kpis = {
  generatedAt: string;
  customersCount: number;
  opportunitiesCount: number;
  transactionsCount: number;
  opportunitiesByStage: { open: number; won: number; lost: number };
  revenue: { total: number; last30Days: number; previous30Days: number };
  conversionRate: number;
  revenueByDay: RevenueByDayPoint[];
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function safeNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") return Number(value);
  return Number(value);
}

async function getRevenueSum(where: Parameters<typeof prisma.transaction.aggregate>[0]["where"] = {}): Promise<number> {
  const result = await prisma.transaction.aggregate({
    where,
    _sum: { amount: true },
  });
  return safeNumber(result._sum.amount);
}

export async function getKpis(): Promise<Kpis> {
  const now = new Date();
  const last30Start = addDays(now, -30);
  const prev30Start = addDays(now, -60);

  const [
    customersCount,
    opportunitiesCount,
    transactionsCount,
    wonCount,
    lostCount,
    openCount,
    revenueTotal,
    revenueLast30,
    revenuePrev30,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.opportunity.count(),
    prisma.transaction.count(),
    prisma.opportunity.count({ where: { stage: "WON" } }),
    prisma.opportunity.count({ where: { stage: "LOST" } }),
    prisma.opportunity.count({ where: { stage: "OPEN" } }),
    getRevenueSum(),
    getRevenueSum({ occurredAt: { gte: last30Start } }),
    getRevenueSum({ occurredAt: { gte: prev30Start, lt: last30Start } }),
  ]);

  const conversionRate = opportunitiesCount === 0 ? 0 : wonCount / opportunitiesCount;

  // Simple revenue-by-day series for last 7 days (for charting)
  const seriesStart = startOfDay(addDays(now, -6));
  const transactions = await prisma.transaction.findMany({
    where: { occurredAt: { gte: seriesStart } },
    select: { occurredAt: true, amount: true },
  });

  const revenueByDayMap = new Map<string, number>();
  for (let i = 0; i < 7; i += 1) {
    const day = startOfDay(addDays(seriesStart, i));
    revenueByDayMap.set(day.toISOString().slice(0, 10), 0);
  }
  for (const tx of transactions) {
    const key = startOfDay(tx.occurredAt).toISOString().slice(0, 10);
    revenueByDayMap.set(key, (revenueByDayMap.get(key) ?? 0) + safeNumber(tx.amount));
  }

  const revenueByDay: RevenueByDayPoint[] = Array.from(revenueByDayMap.entries()).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  return {
    generatedAt: now.toISOString(),
    customersCount,
    opportunitiesCount,
    transactionsCount,
    opportunitiesByStage: { open: openCount, won: wonCount, lost: lostCount },
    revenue: {
      total: revenueTotal,
      last30Days: revenueLast30,
      previous30Days: revenuePrev30,
    },
    conversionRate,
    revenueByDay,
  };
}
