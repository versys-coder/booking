import React from 'react';

interface Props {
  activeTab: number;
  setTab: (tab: number) => void;
}

const TabsBar: React.FC<Props> = ({ activeTab, setTab }) => {
  const tabs = ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'];

  return (
    <div className="pool-tabs" role="tablist" aria-label="Варианты бронирования">
      {tabs.map((label, idx) => {
        const tabIndex = idx + 1;
        return (
          <button
            key={label}
            type="button"
            className={`pool-tab-button ${activeTab === tabIndex ? 'active' : ''}`}
            onClick={() => setTab(tabIndex)}
            role="tab"
            aria-selected={activeTab === tabIndex}
            aria-controls={`variant-${tabIndex}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default TabsBar;