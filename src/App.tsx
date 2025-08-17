import React, { useState, useCallback } from "react";
import "./styles.css";
import Dashboard from "./components/Dashboard";
import DashboardDesigner from "./components/DashboardDesigner";
import PoolWorkload from "./components/PoolWorkload";
import PoolHeatmap from "./components/PoolHeatmap";
import PoolWheelWidget from "./components/PoolWheelWidget";

type TabKey = "dashboard" | "designer" | "pool" | "heatmap" | "wheel";

const TABS: { key: TabKey; label: string }[] = [
  { key: "dashboard", label: "Дашборд" },
  { key: "pool", label: "Гистограмма" },
  { key: "heatmap", label: "Теплокарта" },
  { key: "wheel", label: "Колёса" },
  { key: "designer", label: "Конструктор" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onDesigner={() => setActiveTab("designer")} />;
      case "designer":
        return <DashboardDesigner onBack={() => setActiveTab("dashboard")} />;
      case "pool":
        return <PoolWorkload />;
      case "heatmap":
        return <PoolHeatmap />;
      case "wheel":
        return <PoolWheelWidget />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="app-tabs-bar">
        {TABS.map((t) => {
          const active = t.key === activeTab;
          return (
            <button
              key={t.key}
              className={"app-tab-btn" + (active ? " active" : "")}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{renderContent()}</div>
    </div>
  );
}