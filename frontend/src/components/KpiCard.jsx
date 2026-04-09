import React from "react";

export default function KpiCard({ title, value }) {
  return (
    <div className="card">
      <p className="card-title">{title}</p>
      <p className="card-value">{value}</p>
    </div>
  );
}
