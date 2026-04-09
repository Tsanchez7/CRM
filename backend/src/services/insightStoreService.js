const { prisma } = require("../db/prisma");

function asDate(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid date for kpiSnapshotAt/createdAt");
  }
  return d;
}

async function upsertInsight({
  source,
  kind,
  type,
  title,
  message,
  meta,
  kpiSnapshotAt,
  createdAt,
}) {
  const snapshot = asDate(kpiSnapshotAt);
  const created = createdAt ? asDate(createdAt) : snapshot;

  return prisma.insight.upsert({
    where: {
      source_kind_kpiSnapshotAt: {
        source,
        kind,
        kpiSnapshotAt: snapshot,
      },
    },
    update: {
      type,
      title,
      message,
      meta: meta ?? undefined,
      createdAt: created,
    },
    create: {
      source,
      kind,
      type,
      title,
      message,
      meta: meta ?? undefined,
      kpiSnapshotAt: snapshot,
      createdAt: created,
    },
  });
}

async function saveInsights(insights) {
  if (!Array.isArray(insights) || insights.length === 0) return { saved: 0 };

  // Upsert one-by-one to honor unique constraint
  let saved = 0;
  for (const insight of insights) {
    // eslint-disable-next-line no-await-in-loop
    await upsertInsight(insight);
    saved += 1;
  }

  return { saved };
}

async function listInsights({ limit = 50 } = {}) {
  const take = Math.max(1, Math.min(Number(limit) || 50, 200));
  const rows = await prisma.insight.findMany({
    orderBy: { createdAt: "desc" },
    take,
  });

  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    message: r.message,
    createdAt: r.createdAt.toISOString(),
    meta: r.meta,
    source: r.source,
    kind: r.kind,
    kpiSnapshotAt: r.kpiSnapshotAt.toISOString(),
  }));
}

module.exports = { saveInsights, listInsights };
