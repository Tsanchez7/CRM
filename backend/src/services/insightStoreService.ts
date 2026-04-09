import { prisma } from "../db/prisma";
import type { Prisma } from "@prisma/client";
import type { InsightUpsertInput } from "./insightService";

function asDate(value: unknown): Date {
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid date for kpiSnapshotAt/createdAt");
  }
  return d;
}

type PersistableInsight = Omit<InsightUpsertInput, "meta"> & { meta?: Prisma.InputJsonValue };

async function upsertInsight(input: PersistableInsight) {
  const snapshot = asDate(input.kpiSnapshotAt);
  const created = input.createdAt ? asDate(input.createdAt) : snapshot;

  return prisma.insight.upsert({
    where: {
      source_kind_kpiSnapshotAt: {
        source: input.source,
        kind: input.kind,
        kpiSnapshotAt: snapshot,
      },
    },
    update: {
      type: input.type,
      title: input.title,
      message: input.message,
      meta: input.meta ?? undefined,
      createdAt: created,
    },
    create: {
      source: input.source,
      kind: input.kind,
      type: input.type,
      title: input.title,
      message: input.message,
      meta: input.meta ?? undefined,
      kpiSnapshotAt: snapshot,
      createdAt: created,
    },
  });
}

export async function saveInsights(insights: PersistableInsight[]): Promise<{ saved: number }> {
  if (!Array.isArray(insights) || insights.length === 0) return { saved: 0 };

  let saved = 0;
  for (const insight of insights) {
    // eslint-disable-next-line no-await-in-loop
    await upsertInsight(insight);
    saved += 1;
  }

  return { saved };
}

export async function listInsights({ limit = 50 }: { limit?: unknown } = {}) {
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
