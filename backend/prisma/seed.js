const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.customer.deleteMany();

  const customers = await prisma.customer.createMany({
    data: [
      { id: "cust_acme", name: "ACME Corp", email: "contact@acme.com" },
      { id: "cust_umbrella", name: "Umbrella Ltd", email: "hello@umbrella.com" },
      { id: "cust_globex", name: "Globex", email: "info@globex.com" },
    ],
  });

  const now = new Date();

  await prisma.opportunity.createMany({
    data: [
      {
        id: "opp_1",
        customerId: "cust_acme",
        stage: "WON",
        amount: 12000,
        createdAt: addDays(now, -40),
        closedAt: addDays(now, -35),
      },
      {
        id: "opp_2",
        customerId: "cust_acme",
        stage: "LOST",
        amount: 8000,
        createdAt: addDays(now, -20),
        closedAt: addDays(now, -10),
      },
      {
        id: "opp_3",
        customerId: "cust_umbrella",
        stage: "OPEN",
        amount: 15000,
        createdAt: addDays(now, -5),
      },
      {
        id: "opp_4",
        customerId: "cust_globex",
        stage: "WON",
        amount: 5000,
        createdAt: addDays(now, -15),
        closedAt: addDays(now, -12),
      },
    ],
  });

  await prisma.transaction.createMany({
    data: [
      {
        id: "tx_1",
        customerId: "cust_acme",
        opportunityId: "opp_1",
        amount: 12000,
        occurredAt: addDays(now, -35),
      },
      {
        id: "tx_2",
        customerId: "cust_globex",
        opportunityId: "opp_4",
        amount: 5000,
        occurredAt: addDays(now, -12),
      },
      // last 7 days series
      {
        id: "tx_3",
        customerId: "cust_acme",
        amount: 300,
        occurredAt: addDays(now, -6),
      },
      {
        id: "tx_4",
        customerId: "cust_acme",
        amount: 700,
        occurredAt: addDays(now, -4),
      },
      {
        id: "tx_5",
        customerId: "cust_umbrella",
        amount: 250,
        occurredAt: addDays(now, -2),
      },
    ],
  });

  // eslint-disable-next-line no-console
  console.log("Seed complete");
  // eslint-disable-next-line no-console
  console.log("Customers created:", customers.count);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
