import { prisma } from "../db/prisma";
import { eventBus } from "./eventBus";
import { getKpis } from "./kpiService";
import { generateInsightsFromKpis } from "./insightService";
import { saveInsights } from "./insightStoreService";

type ImportPayload = {
  customers?: Array<{ id?: string; name?: string; email?: string | null; createdAt?: string | Date }>;
  opportunities?: Array<{
    id?: string;
    customerId?: string;
    stage?: "OPEN" | "WON" | "LOST";
    amount?: number;
    createdAt?: string | Date;
    closedAt?: string | Date;
  }>;
  transactions?: Array<{
    id?: string;
    customerId?: string;
    opportunityId?: string | null;
    amount?: number;
    occurredAt?: string | Date;
  }>;
};

function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function getConfig() {
  const threshold = Number(process.env.CONVERSION_RATE_THRESHOLD ?? "0.2");
  return {
    conversionRateThreshold: Number.isFinite(threshold) ? threshold : 0.2,
  };
}

export async function importData(payload: ImportPayload) {
  const customers = Array.isArray(payload?.customers) ? payload.customers : [];
  const opportunities = Array.isArray(payload?.opportunities) ? payload.opportunities : [];
  const transactions = Array.isArray(payload?.transactions) ? payload.transactions : [];

  if (customers.length > 0) {
    await prisma.customer.createMany({
      data: customers.map((c) => ({
        id: c.id,
        name: c.name ?? "Unnamed Customer",
        email: c.email ?? null,
        createdAt: toDate(c.createdAt),
      })),
      skipDuplicates: true,
    });
  }

  if (opportunities.length > 0) {
    await prisma.opportunity.createMany({
      data: opportunities.map((o) => ({
        id: o.id,
        customerId: o.customerId as string,
        stage: (o.stage ?? "OPEN") as "OPEN" | "WON" | "LOST",
        amount: o.amount ?? 0,
        createdAt: toDate(o.createdAt),
        closedAt: toDate(o.closedAt),
      })),
      skipDuplicates: true,
    });
  }

  if (transactions.length > 0) {
    await prisma.transaction.createMany({
      data: transactions.map((t) => ({
        id: t.id,
        customerId: t.customerId as string,
        opportunityId: t.opportunityId ?? null,
        amount: t.amount ?? 0,
        occurredAt: toDate(t.occurredAt),
      })),
      skipDuplicates: true,
    });
  }

  const kpis = await getKpis();

  const { conversionRateThreshold } = getConfig();
  const ruleInsights = generateInsightsFromKpis(kpis, { conversionRateThreshold });
  await saveInsights(ruleInsights);

  eventBus.emit("kpis.calculated", { kpis });

  return {
    imported: {
      customers: customers.length,
      opportunities: opportunities.length,
      transactions: transactions.length,
    },
    kpis,
  };
}
