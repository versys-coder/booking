import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import DashboardDesigner from "./components/DashboardDesigner";

export default function App() {
  const [designerMode, setDesignerMode] = useState(false);

  if (designerMode) {
    return (
      <DashboardDesigner onBack={() => setDesignerMode(false)} />
    );
  }

  return (
    <Dashboard onDesigner={() => setDesignerMode(true)} />
  );
}