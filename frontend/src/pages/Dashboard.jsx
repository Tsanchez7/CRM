import React, { useEffect, useMemo, useState } from "react";
import { fetchKpis } from "../api/dtihApi";
import KpiCard from "../components/KpiCard";
import SimpleBarChart from "../components/SimpleBarChart";

function money(value) {
  const n = Number(value) || 0;
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function pct(value) {
  const n = Number(value) || 0;
  return `${Math.round(n * 1000) / 10}%`;
}

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchKpis();
      setKpis(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const cards = useMemo(() => {
    if (!kpis) return [];
    return [
      { title: "Revenue total", value: money(kpis.revenue?.total) },
      { title: "Revenue (últimos 30 días)", value: money(kpis.revenue?.last30Days) },
      { title: "Conversion rate", value: pct(kpis.conversionRate) },
      { title: "Customers", value: String(kpis.customersCount) },
      { title: "Opportunities", value: String(kpis.opportunitiesCount) },
      { title: "Transactions", value: String(kpis.transactionsCount) },
    ];
  }, [kpis]);

  return (
    <div className="section">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 className="section-title">KPIs</h2>
        <button className="button" onClick={load} disabled={loading}>
          {loading ? "Cargando..." : "Refrescar"}
        </button>
      </div>

      {error ? <div className="card">Error: {error}</div> : null}

      <div className="grid">
        {cards.map((c) => (
          <div key={c.title} style={{ gridColumn: "span 4" }}>
            <KpiCard title={c.title} value={c.value} />
          </div>
        ))}
        <div style={{ gridColumn: "span 12" }}>
          <SimpleBarChart data={kpis?.revenueByDay ?? []} />
        </div>
      </div>
    </div>
  );
}
