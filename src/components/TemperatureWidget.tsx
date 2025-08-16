import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Collapse } from "@mui/material";

const TEMP_CARD_ORDER = ["Тренировочный", "Детский", "Демонстрационный", "Прыжковый"];

export function TemperatureWidget() {
  const [temps, setTemps] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("http://10.18.15.85:4000/api/pools-temps")
      .then((res) => res.json())
      .then((data) => {
        setTemps(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Box
      sx={{
        minWidth: 230,
        maxWidth: open ? 750 : 320,
        transition: "max-width 0.4s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => setOpen((v) => !v)}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 6,
          px: open ? 4 : 3,
          py: 2,
          minWidth: 230,
          maxWidth: open ? 750 : 320,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-start" : "center",
          flexDirection: "row",
          transition: "max-width 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s",
          boxShadow: open ? "0 2px 24px #185a9022" : "0 2px 12px #185a9011",
          gap: open ? 3 : 0,
        }}
      >
        {/* Тренировочный всегда виден */}
        <Box
          sx={{
            minWidth: 160,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pr: open ? 4 : 0,
            borderRight: open ? "2px solid #eaf1f8" : "none",
            transition: "border 0.2s",
          }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: 500, mb: 0.5, color: "#185a90" }}>
            Температура
          </Typography>
          <Typography sx={{ fontSize: 58, fontWeight: 900, color: "#222" }}>
            {loading
              ? "…"
              : temps["Тренировочный"] != null
              ? temps["Тренировочный"]!.toFixed(1) + "°C"
              : "—"}
          </Typography>
          <Typography sx={{ fontSize: 20, color: "#333", fontWeight: 500 }}>
            Тренировочный_stas
          </Typography>
        </Box>
        {/* Остальные бассейны - только если open */}
        <Collapse in={open} orientation="horizontal" timeout={400}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 4, pl: 4 }}>
            {TEMP_CARD_ORDER.filter((p) => p !== "Тренировочный").map((pool) => (
              <Box
                key={pool}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 18, color: "#185a90", fontWeight: 600 }}>
                  {pool}
                </Typography>
                <Typography sx={{ fontSize: 40, fontWeight: 900, color: "#222" }}>
                  {loading
                    ? "…"
                    : temps[pool] != null
                    ? temps[pool]!.toFixed(1) + "°C"
                    : "—"}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
}