import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const;
const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;

interface Slot {
  appointment_id: string;
  start_date: string;
  service_id: string;
  [key: string]: any;
}

interface SlotPickerProps {
  slotsByDate: Record<string, Slot[]>;
  calendarDates: string[];
  currentDateIdx: number;
  setCurrentDateIdx: React.Dispatch<React.SetStateAction<number>>;
  selectedSlot: Slot | null;
  setSelectedSlot: React.Dispatch<React.SetStateAction<Slot | null>>;
  isLoading: boolean;
}

const SlotPicker: React.FC<SlotPickerProps> = ({
  slotsByDate,
  calendarDates,
  currentDateIdx,
  setCurrentDateIdx,
  selectedSlot,
  setSelectedSlot,
  isLoading,
}) => {
  const ALL_TIMES = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  if (isLoading) {
    return (
      <Box style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
        <CircularProgress size={48} />
      </Box>
    );
  }
  if (!calendarDates.length) return null;

  const selectedDate = calendarDates[currentDateIdx];
  const slotList = slotsByDate[selectedDate] || [];
  const isWorkingDay = (() => {
    const d = new Date(selectedDate + "T00:00:00");
    const day = d.getDay();
    return day >= 1 && day <= 5;
  })();
  const nowLocal = new Date();
  const nowLocalDateString = nowLocal.toISOString().split("T")[0];

  function formatDatePretty(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} (${WEEKDAYS[d.getDay()]})`;
  }

  const slotsByTime: Record<string, Slot> = {};
  slotList.forEach((slot) => {
    const slotTime = new Date(slot.start_date.replace(" ", "T")).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    slotsByTime[slotTime] = slot;
  });

  const InactiveTimeSlot: React.FC<{ time: string }> = ({ time }) => (
    <div className="time-slot">{time}</div>
  );

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          marginTop: 8,
        }}
      >
        <Button
          style={{ minWidth: 32, borderRadius: 5 }}
          onClick={() => setCurrentDateIdx((i) => Math.max(i - 1, 0))}
          disabled={currentDateIdx === 0}
          color="primary"
        >
          {"<"}
        </Button>
        <Typography
          align="center"
          style={{
            fontWeight: 700,
            fontSize: 26,
            margin: "0 16px",
            color: "#31628c",
            letterSpacing: "0.02em",
          }}
        >
          {formatDatePretty(selectedDate)}
        </Typography>
        <Button
          style={{ minWidth: 32, borderRadius: 5 }}
          onClick={() => setCurrentDateIdx((i) => Math.min(i + 1, calendarDates.length - 1))}
          disabled={currentDateIdx === calendarDates.length - 1}
          color="primary"
        >
          {">"}
        </Button>
      </Box>
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {ALL_TIMES.map((time) => {
          if (isWorkingDay && time === "12:00") {
            return <InactiveTimeSlot key={time} time={time} />;
          }
          const slot = slotsByTime[time];
          if (slot) {
            const [hour, minute] = time.split(":");
            const slotDate = new Date(`${selectedDate}T${hour}:${minute}:00`);
            if (selectedDate === nowLocalDateString && slotDate < nowLocal) {
              return <InactiveTimeSlot key={time} time={time} />;
            }
            const isSelected = selectedSlot?.appointment_id === slot.appointment_id;
            return (
              <Button
                key={time}
                className={`slot-button${isSelected ? " selected" : ""}`}
                variant={isSelected ? "contained" : "outlined"}
                color={isSelected ? "primary" : "inherit"}
                onClick={() => setSelectedSlot(slot)}
                endIcon={isSelected ? <CheckCircleIcon sx={{ fontSize: 21 }} /> : null}
              >
                {time}
              </Button>
            );
          }
          return <InactiveTimeSlot key={time} time={time} />;
        })}
      </Box>
      {selectedSlot && (
        <Typography
          align="center"
          style={{
            marginTop: 8,
            fontSize: 20,
            color: "#31628c",
            letterSpacing: "0.01em",
            fontWeight: 700,
          }}
        >
          Вы выбрали:{" "}
          <b>
            {new Date(selectedSlot.start_date.replace(" ", "T")).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </b>
        </Typography>
      )}
    </Box>
  );
};

export default SlotPicker;