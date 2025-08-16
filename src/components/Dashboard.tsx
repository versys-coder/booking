import React from "react";
import BookingApp from "./BookingApp";
import { TemperatureWidget } from "./TemperatureWidget";

const LoadWidget = () => (
  <div style={{ textAlign: 'center', fontSize: 24, color: '#185a90' }}>
    Загруженность: <b>45%</b>
  </div>
);

const ScheduleWidget = () => (
  <div style={{ textAlign: 'center', fontSize: 24, color: '#185a90' }}>
    Сегодня: 2 события
  </div>
);

export default function Dashboard({ onDesigner }: { onDesigner?: () => void }) {
  return (
    <div>
      {onDesigner && (
        <button
          onClick={onDesigner}
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 1000,
            padding: "10px 24px",
            fontSize: 18,
            background: "#185a90",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            boxShadow: "0 2px 8px #185a9022",
            cursor: "pointer"
          }}
        >
          В режим конструктора
        </button>
      )}

      {/* Обычная сетка для дашборда */}
      <div className="dashboard-grid">
        <div className="dashboard-widget temp-widget">
          <TemperatureWidget />
        </div>
        <div className="dashboard-widget load-widget">
          <LoadWidget />
        </div>
        <div className="dashboard-widget schedule-widget">
          <ScheduleWidget />
        </div>
        <div className="dashboard-widget booking-widget">
          <BookingApp />
        </div>
      </div>
    </div>
  );
}