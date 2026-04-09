import React from "react";
import Dashboard from "./pages/Dashboard";
import Insights from "./pages/Insights";

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="h1">Digital Transformation Insights Hub</h1>
        <p className="subtle">KPIs + insights automáticos + workflow básico</p>
      </header>

      <Dashboard />
      <Insights />
    </div>
  );
}
