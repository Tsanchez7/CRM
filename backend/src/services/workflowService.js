const { eventBus } = require("./eventBus");
const { saveInsights } = require("./insightStoreService");

function initWorkflow({ conversionRateThreshold }) {
  eventBus.on("kpis.calculated", ({ kpis }) => {
    if (!kpis) return;

    if (kpis.conversionRate < conversionRateThreshold) {
      const kpiSnapshotAt = new Date(kpis.generatedAt);
      void saveInsights([
        {
          source: "WORKFLOW",
          kind: "CONVERSION_BELOW_THRESHOLD",
          type: "WORKFLOW_ALERT",
          title: "Workflow: alerta de conversión",
          message: `Regla aplicada: conversion_rate < ${conversionRateThreshold}.`,
          createdAt: kpiSnapshotAt,
          kpiSnapshotAt,
          meta: { conversionRate: kpis.conversionRate, conversionRateThreshold },
        },
      ]).catch(() => {
        // ignore persistence errors in MVP
      });
    }
  });
}

module.exports = { initWorkflow };
