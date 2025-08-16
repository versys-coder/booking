import React, { useState } from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import BookingApp from "./BookingApp";
import { TemperatureWidget } from "./TemperatureWidget";

const LoadWidget = () => <div>Загруженность: <b>45%</b></div>;
const ScheduleWidget = () => <div>Сегодня: 2 события</div>;

const ReactGridLayout = WidthProvider(RGL);

type WidgetKey = "temp" | "load" | "schedule" | "booking";

type WidgetStyle = {
  fontSize: number;
  color: string;
  bg: string;
  bgAlpha: number;
};

const initialStyles: Record<WidgetKey, WidgetStyle> = {
  temp: { fontSize: 28, color: "#185a90", bg: "#fff", bgAlpha: 0.96 },
  load: { fontSize: 28, color: "#185a90", bg: "#fff", bgAlpha: 0.96 },
  schedule: { fontSize: 28, color: "#185a90", bg: "#fff", bgAlpha: 0.96 },
  booking: { fontSize: 28, color: "#185a90", bg: "#fff", bgAlpha: 0.96 },
};

const widgetNames: Record<WidgetKey, string> = {
  temp: "Температура",
  load: "Загруженность",
  schedule: "Расписание",
  booking: "Бронирование",
};

const widgetComponents: Record<WidgetKey, React.FC> = {
  temp: TemperatureWidget,
  load: LoadWidget,
  schedule: ScheduleWidget,
  booking: BookingApp,
};

// Четкая 2x2 сетка
const defaultLayout: Layout[] = [
  { i: "temp", x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
  { i: "load", x: 1, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
  { i: "schedule", x: 0, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
  { i: "booking", x: 1, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
];

export default function DashboardDesigner({ onBack }: { onBack?: () => void }) {
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);
  const [styles, setStyles] = useState<Record<WidgetKey, WidgetStyle>>(initialStyles);
  const [selected, setSelected] = useState<WidgetKey>("temp");

  const handleStyleChange = (field: keyof WidgetStyle, value: any) => {
    setStyles((prev) => ({
      ...prev,
      [selected]: {
        ...prev[selected],
        [field]: value,
      },
    }));
  };

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      background: "#eef7fc",
      position: "relative",
      overflowX: "auto"
    }}>
      {/* Кнопка возврата */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "fixed",
            top: 24,
            left: 24,
            zIndex: 100,
            padding: "12px 24px",
            fontSize: 18,
            background: "#185a90",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            boxShadow: "0 2px 8px #185a9022",
            cursor: "pointer"
          }}
        >
          ← В обычный режим
        </button>
      )}

      {/* Панель управления стилями */}
      <div
        style={{
          position: "fixed",
          right: 24,
          top: 24,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 18px #185a9024",
          zIndex: 10,
          padding: 24,
          minWidth: 260,
        }}
      >
        <div style={{ marginBottom: 12, fontWeight: 700 }}>
          Редактировать:{" "}
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value as WidgetKey)}
            style={{ fontWeight: 700 }}
          >
            {Object.entries(widgetNames).map(([k, v]) => (
              <option value={k} key={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Размер шрифта: {styles[selected].fontSize}px</label>
          <input
            type="range"
            min={18}
            max={64}
            value={styles[selected].fontSize}
            onChange={(e) => handleStyleChange("fontSize", Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Цвет шрифта:</label>
          <input
            type="color"
            value={styles[selected].color}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            style={{ width: "100%", height: 32 }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Цвет фона:</label>
          <input
            type="color"
            value={styles[selected].bg}
            onChange={(e) => handleStyleChange("bg", e.target.value)}
            style={{ width: "100%", height: 32 }}
          />
        </div>
        <div>
          <label>Прозрачность: {Math.round(styles[selected].bgAlpha * 100)}%</label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={styles[selected].bgAlpha}
            onChange={(e) => handleStyleChange("bgAlpha", Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Грид-контейнер с фикс шириной */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "60px 0 0 0",
        position: "relative",
        zIndex: 2
      }}>
        <ReactGridLayout
          layout={layout}
          onLayoutChange={setLayout}
          cols={2}
          rowHeight={220}
          width={900}
          isResizable={true}
          isDraggable={true}
          compactType={null}
          preventCollision={true}
        >
          {Object.keys(widgetNames).map((k) => {
            const key = k as WidgetKey;
            const Comp = widgetComponents[key];
            return (
              <div
                key={key}
                style={{
                  width: "100%",
                  height: "100%",
                  minWidth: 0,
                  minHeight: 0,
                  background: styles[key].bg,
                  color: styles[key].color,
                  opacity: styles[key].bgAlpha,
                  borderRadius: 24,
                  boxShadow: "0 2px 18px #185a9022",
                  fontSize: styles[key].fontSize,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: selected === key ? "2px solid #185a90" : "2px solid transparent",
                  transition: "border 0.15s",
                  userSelect: "none",
                  overflow: "hidden"
                }}
                onClick={() => setSelected(key)}
              >
                {/* drag-handle не нужен — drag работает по всей карточке */}
                <Comp />
              </div>
            );
          })}
        </ReactGridLayout>
      </div>
    </div>
  );
}