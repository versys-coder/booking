import React from "react";
import "./styles.css";
import PoolBookingTabs from "./components/integrations/PoolBookingTabs";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PoolBookingTabs />
    </div>
  );
}