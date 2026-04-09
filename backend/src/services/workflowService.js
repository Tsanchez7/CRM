const { eventBus } = require("./eventBus");

const insightStore = [];

function addWorkflowInsight(insight) {
  insightStore.unshift(insight);
  // keep small in-memory history
  if (insightStore.length > 50) insightStore.length = 50;
}

function initWorkflow({ conversionRateThreshold }) {
  eventBus.on("kpis.calculated", ({ kpis }) => {
    if (!kpis) return;

    if (kpis.conversionRate < conversionRateThreshold) {
      addWorkflowInsight({
        id: `workflow-alert-${kpis.generatedAt}`,
        type: "WORKFLOW_ALERT",
        title: "Workflow: alerta de conversión",
        message: `Regla aplicada: conversion_rate < ${conversionRateThreshold}.`,
        createdAt: kpis.generatedAt,
        meta: { conversionRate: kpis.conversionRate, conversionRateThreshold },
      });
    }
  });
}

function getWorkflowInsights() {
  return [...insightStore];
}

module.exports = { initWorkflow, getWorkflowInsights };
