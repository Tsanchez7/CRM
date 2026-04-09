const { prisma } = require("../db/prisma");
const { eventBus } = require("./eventBus");
const { getKpis } = require("./kpiService");

function toDate(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function importData(payload) {
  const customers = Array.isArray(payload?.customers) ? payload.customers : [];
  const opportunities = Array.isArray(payload?.opportunities) ? payload.opportunities : [];
  const transactions = Array.isArray(payload?.transactions) ? payload.transactions : [];

  // Customers
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

  // Opportunities
  if (opportunities.length > 0) {
    await prisma.opportunity.createMany({
      data: opportunities.map((o) => ({
        id: o.id,
        customerId: o.customerId,
        stage: o.stage ?? "OPEN",
        amount: o.amount ?? 0,
        createdAt: toDate(o.createdAt),
        closedAt: toDate(o.closedAt),
      })),
      skipDuplicates: true,
    });
  }

  // Transactions
  if (transactions.length > 0) {
    await prisma.transaction.createMany({
      data: transactions.map((t) => ({
        id: t.id,
        customerId: t.customerId,
        opportunityId: t.opportunityId ?? null,
        amount: t.amount ?? 0,
        occurredAt: toDate(t.occurredAt),
      })),
      skipDuplicates: true,
    });
  }

  const kpis = await getKpis();
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

module.exports = { importData };
