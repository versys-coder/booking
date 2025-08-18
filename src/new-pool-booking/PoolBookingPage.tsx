import React, { useState } from 'react';
import PoolBookingLayout from './layouts/PoolBookingLayout';
import TabsBar from './components/TabsBar';
import IndicatorsRow from './components/IndicatorsRow';
import BookingArea from './components/BookingArea';
import BookingVariant1 from './components/BookingVariants/BookingVariant1';
import BookingVariant2 from './components/BookingVariants/BookingVariant2';
import BookingVariant3 from './components/BookingVariants/BookingVariant3';
import BookingVariant4 from './components/BookingVariants/BookingVariant4';

// import centralized stylesheet
import './styles/poolBooking.css';

const PoolBookingPage: React.FC = () => {
  const [tab, setTab] = useState<number>(4);

  // Пример данных — можно подключить стор/хуки и передавать реальные данные
  const poolStats = { people: 7, free: 113 };
  const temperature = 27.3;

  return (
    <PoolBookingLayout>
      <TabsBar activeTab={tab} setTab={setTab} />
      <IndicatorsRow poolStats={poolStats} temperature={temperature} />
      <BookingArea>
        {tab === 1 && <BookingVariant1 />}
        {tab === 2 && <BookingVariant2 />}
        {tab === 3 && <BookingVariant3 />}
        {tab === 4 && <BookingVariant4 />}
      </BookingArea>
    </PoolBookingLayout>
  );
};

export default PoolBookingPage;