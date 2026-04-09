import React from "react";

export default function SimpleBarChart({ data }) {
  const max = Math.max(0, ...(data ?? []).map((d) => Number(d.revenue) || 0));

  if (!data || data.length === 0) {
    return <div className="card">No data</div>;
  }

  return (
    <div className="card">
      <p className="card-title">Revenue (últimos 7 días)</p>
      <div className="bar-chart" aria-label="Revenue bar chart">
        {data.map((d) => {
          const v = Number(d.revenue) || 0;
          const h = max === 0 ? 0 : Math.round((v / max) * 100);
          const label = String(d.date).slice(5);
          return (
            <div key={d.date} className="bar-wrap" title={`${d.date}: ${v}`}
            >
              <div className="bar" style={{ height: `${h}%` }} />
              <div className="bar-label">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
