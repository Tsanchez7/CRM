import React, { useEffect, useState } from "react";
import { fetchInsights } from "../api/dtihApi";
import InsightList from "../components/InsightList";

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInsights();
      setInsights(data.insights || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="section">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 className="section-title">Insights</h2>
        <button className="button" onClick={load} disabled={loading}>
          {loading ? "Cargando..." : "Refrescar"}
        </button>
      </div>

      {error ? <div className="card">Error: {error}</div> : null}
      <InsightList insights={insights} />
    </div>
  );
}
