import React from "react";
import PoolWheelWidget from "../PoolWheelWidget";

interface Props {
  onSelectSlot: (date: string, hour: number) => void;
}

/**
 * Интеграция для "колеса" — лёгкий обёртчик, адаптированный под глобальную тему.
 * Использует существующие CSS-переменные (шрифт/цвет/радиусы) и класс .pw-root из styles.css.
 */
const PoolWheelBookingIntegratedFull: React.FC<Props> = ({ onSelectSlot }) => {
  return (
    <div
      className="pw-root"
      style={{
        // Основные значения мы держим в CSS-переменных, но на всякий случай указываем их через inline,
        // чтобы компонент корректно реагировал на live-изменения ThemeControls.
        fontFamily: "var(--theme-font-family)",
        color: "var(--theme-color)",
        background: "var(--color-bg-section)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 720, margin: "0 auto", boxSizing: "border-box" }}>
        <PoolWheelWidget onSelectSlot={onSelectSlot} />
      </div>
    </div>
  );
};

export default PoolWheelBookingIntegratedFull;