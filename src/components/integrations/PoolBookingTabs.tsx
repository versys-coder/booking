import React, { useState, useMemo } from "react";
import BookingApp from "../BookingApp";
import PoolWorkload from "../PoolWorkload";
import PoolWorkloadBookingIntegrated from "./PoolWorkloadBookingIntegrated";
import PoolHeatmapBookingIntegratedFull from "./PoolHeatmapBookingIntegratedFull";
import PoolWheelBookingIntegratedFull from "./PoolWheelBookingIntegratedFull";
import QuickBookingFlow, { VirtualSlot } from "./QuickBookingFlow";
import { useSlotsIndex } from "./useSlotsIndex";

type LocalTabKey =
  | "visual-combo"
  | "workload-integration"
  | "heatmap-integration"
  | "wheel-integration";

const LOCAL_TABS: { key: LocalTabKey; label: string }[] = [
  { key: "visual-combo", label: "Вариант 1" },
  { key: "workload-integration", label: "Вариант 2" },
  { key: "heatmap-integration", label: "Вариант 3" },
  { key: "wheel-integration", label: "Вариант 4" },
];

export default function PoolBookingTabs() {
  const [tab, setTab] = useState<LocalTabKey>("visual-combo");
  const [selectedSlot, setSelectedSlot] = useState<VirtualSlot | null>(null);
  const { loading: slotsLoading, error: slotsError, resolveSlot } = useSlotsIndex();

  function handleSelectHour(date: string, hour: number) {
    const real = resolveSlot(date, hour);
    if (real) {
      setSelectedSlot({
        appointment_id: real.appointment_id,
        start_date: real.start_date,
        date,
        hour,
      });
    } else {
      setSelectedSlot({
        appointment_id: `virtual-${date}-${hour}`,
        start_date: `${date} ${String(hour).padStart(2, "0")}:00:00`,
        date,
        hour,
      });
    }
  }
  function resetFlow() {
    setSelectedSlot(null);
  }

  const headerStatus = useMemo(() => {
    if (slotsLoading) return "Слоты: загрузка…";
    if (slotsError) return "Слоты: ошибка";
    return "Слоты: ✓";
  }, [slotsLoading, slotsError]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6fafd",
        fontFamily: '"Roboto Condensed", Arial, sans-serif',
        color: "#606A76",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Кнопки вкладок */}
      <div className="pool-booking-tabs-bar">
        {LOCAL_TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSelectedSlot(null);
              }}
              className={`pool-booking-tab-btn${active ? " active" : ""}`}
              type="button"
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: 1400,
          flex: 1,
          minHeight: 0,
          padding: "8px 16px 32px",
          overflow: "auto",
        }}
      >
        {/* ВАРИАНТ 1: Сверху индикаторы, ниже — график и бронирование в один ряд */}
        <div style={{ display: tab === "visual-combo" ? "block" : "none" }}>
          {/* Индикаторы (оставьте как есть) */}
          <div className="visual-combo-indicators" style={{ display: "flex", gap: 24, marginBottom: 40, justifyContent: "center" }}>
            {/* Ваши реальные индикаторы сюда */}
            {/* ... */}
          </div>
          {/* График + бронирование */}
          <div className="pool-section-row">
            <div className="pool-section-col">
              <PoolWorkload compact onHourSelect={handleSelectHour} />
            </div>
            <div className="pool-section-col">
              <BookingApp />
            </div>
          </div>
        </div>

        {/* Остальные табы — как раньше */}
        <div style={{ display: tab === "workload-integration" ? "block" : "none" }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ flex: "1 1 640px", minWidth: 480 }}>
              <PoolWorkloadBookingIntegrated onSelectSlot={handleSelectHour} />
            </div>
            <div style={{ flex: "1 1 460px", minWidth: 420 }}>
              <QuickBookingFlow
                virtualSlot={selectedSlot}
                onReset={resetFlow}
                hintWhenNoSlot="Наведите на столбец и нажмите 'Забронировать'"
              />
            </div>
          </div>
        </div>

        <div style={{ display: tab === "heatmap-integration" ? "block" : "none" }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ flex: "1 1 640px", minWidth: 480 }}>
              <PoolHeatmapBookingIntegratedFull onSelectSlot={handleSelectHour} />
            </div>
            <div style={{ flex: "1 1 460px", minWidth: 420 }}>
              <QuickBookingFlow
                virtualSlot={selectedSlot}
                onReset={resetFlow}
                hintWhenNoSlot="Кликните на клетку и нажмите 'Забронировать'"
              />
            </div>
          </div>
        </div>

        <div style={{ display: tab === "wheel-integration" ? "block" : "none" }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ flex: "1 1 480px", minWidth: 380 }}>
              <PoolWheelBookingIntegratedFull onSelectSlot={handleSelectHour} />
            </div>
            <div style={{ flex: "1 1 460px", minWidth: 420 }}>
              <QuickBookingFlow
                virtualSlot={selectedSlot}
                onReset={resetFlow}
                hintWhenNoSlot="Выберите время колесом и нажмите 'Забронировать'"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Статус внизу */}
      <div style={{ padding: "8px 12px", fontSize: 13, color: "rgba(0,0,0,0.55)" }}>
        {headerStatus}
      </div>
    </div>
  );
}