import React from 'react';

interface PoolStats {
  people: number;
  free: number;
}

interface Props {
  poolStats: PoolStats;
  temperature: number | string;
}

const IndicatorsRow: React.FC<Props> = ({ poolStats, temperature }) => {
  return (
    <div className="pool-indicators-row" aria-hidden={false}>
      <div className="pool-indicator-card">
        <div className="pool-indicator-label">В бассейне</div>
        <div className="pool-indicator-value">{poolStats.people}</div>
        <div className="pool-indicator-desc">сейчас человек</div>
      </div>

      <div className="pool-indicator-card">
        <div className="pool-indicator-label">Свободно мест</div>
        <div className="pool-indicator-value">{poolStats.free}</div>
        <div className="pool-indicator-desc">мест осталось</div>
      </div>

      <div className="pool-indicator-card">
        <div className="pool-indicator-label">Температура</div>
        <div className="pool-indicator-value">{temperature}°C</div>
        <div className="pool-indicator-desc">тренировочный</div>
      </div>
    </div>
  );
};

export default IndicatorsRow;