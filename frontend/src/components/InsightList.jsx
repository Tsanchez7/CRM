import React from "react";

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

export default function InsightList({ insights }) {
  if (!insights || insights.length === 0) {
    return <div className="card">No insights</div>;
  }

  return (
    <div className="list">
      {insights.map((i) => (
        <div key={i.id} className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div className="row">
              <span className="badge">{i.type}</span>
              <strong>{i.title}</strong>
            </div>
            <span className="subtle">{formatDate(i.createdAt)}</span>
          </div>
          <p style={{ margin: "10px 0 0 0" }}>{i.message}</p>
        </div>
      ))}
    </div>
  );
}
