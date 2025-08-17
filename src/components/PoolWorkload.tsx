import React, { useEffect, useMemo, useRef, useState } from "react";

const BAR_WIDTH = 60;
const BAR_GAP = 11;
const LEFT_PADDING = 100;
const TOP_PADDING = 28;
const TOTAL_LANES = 10;
const LANE_CAPACITY = 12;
const SEGMENT_HEIGHT = 12;
const SEGMENT_GAP = 3;
const COLOR_TOP = "#185a90";
const COLOR_BOTTOM = "#99e8fa";
const INACTIVE_COLOR = "#eaf1f8";
const HOUR_START = 7;
const HOUR_END = 21;

interface Slot {
  date: string;
  hour: number;
  current: number | null;
  freeLanes: number;
  busyLanes: number;
  totalLanes: number;
  freePlaces: number;
  totalPlaces: number;
  isBreak: boolean;
}

interface CurrentNow {
  date: string;
  hour: number;
  current: number | null;
  source: string;
}

interface ApiResponse {
  currentNow: CurrentNow;
  meta: {
    serverNowDate: string;
    serverNowHour: number;
    tzOffset: number;
  };
  slots: Slot[];
}

interface PopupState {
  left: number;
  top: number;
  value: number;
  hour: number;
  isBreak: boolean;
}

function formatDateShortRu(iso: string) {
  if (!iso) return "";
  const [, m, d] = iso.split("-");
  const months = [
    "января","февраля","марта","апреля","мая","июня",
    "июля","августа","сентября","октября","ноября","декабря"
  ];
  return `${+d} ${months[+m - 1]}`;
}

function getWeekdayRu(iso: string) {
  const names = [
    "Воскресенье","Понедельник","Вторник","Среда",
    "Четверг","Пятница","Суббота"
  ];
  return names[new Date(iso).getDay()];
}

function isBreakHour(dateIso: string, hour: number) {
  if (hour !== 12) return false;
  const d = new Date(dateIso).getDay();
  return d >= 1 && d <= 5;
}

function lerpColor(a: string, b: string, t: number) {
  const ah = a.replace("#","");
  const bh = b.replace("#","");
  const ar = parseInt(ah.slice(0,2),16);
  const ag = parseInt(ah.slice(2,4),16);
  const ab = parseInt(ah.slice(4,6),16);
  const br = parseInt(bh.slice(0,2),16);
  const bg = parseInt(bh.slice(2,4),16);
  const bb = parseInt(bh.slice(4,6),16);
  const rr = Math.round(ar + (br - ar)*t);
  const rg = Math.round(ag + (bg - ag)*t);
  const rb = Math.round(ab + (bb - ab)*t);
  return "#" + ((1<<24) + (rr<<16)+(rg<<8)+rb).toString(16).slice(1);
}

const Popup: React.FC<PopupState> = ({ value, hour, isBreak, left, top }) => (
  <div
    style={{
      position:'absolute',
      left, top,
      minWidth:130,
      maxWidth:210,
      background:'#fff',
      borderRadius:16,
      boxShadow:'0 2.5px 22px rgba(24,90,144,.11)',
      padding:'16px 24px 13px',
      zIndex:101,
      fontSize:22,
      color:'#185a90',
      fontWeight:600,
      userSelect:'none',
      border:'1px solid #eaf8ff'
    }}
  >
    <div style={{ fontSize:20, fontWeight:900, marginBottom:7 }}>
      {hour}:00 — {hour+1}:00
    </div>
    {isBreak ? (
      <div style={{ color:'#185a90', fontSize:18, fontWeight:800 }}>ПЕРЕРЫВ</div>
    ) : (
      <>
        <div>Свободно дорожек: <b>{value}</b></div>
        <div>Свободно мест: <b>{value * LANE_CAPACITY}</b></div>
      </>
    )}
  </div>
);

const PoolWorkload: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [currentNow, setCurrentNow] = useState<CurrentNow | null>(null);
  const [meta, setMeta] = useState<ApiResponse["meta"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const popupTimeout = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const hourColumns = useMemo(
    () => Array.from({length: HOUR_END - HOUR_START + 1},(_,i)=>HOUR_START+i),
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pool-workload?start_hour=7&end_hour=21");
      if (!res.ok) throw new Error(res.statusText);
      const data: ApiResponse = await res.json();
      setSlots(data.slots || []);
      setCurrentNow(data.currentNow);
      setMeta(data.meta);
      setError(null);
    } catch (e:any) {
      setError(e.message || "Ошибка запроса");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    fetchData();
  }, []);

  const dates = useMemo(()=>{
    const s = new Set<string>();
    for (const sl of slots) s.add(sl.date);
    return Array.from(s).sort();
  }, [slots]);

  useEffect(()=> {
    if (meta?.serverNowDate && dates.length) {
      const idx = dates.indexOf(meta.serverNowDate);
      if (idx >= 0) setSelectedIdx(idx);
    }
  }, [meta?.serverNowDate, dates]);

  const freeMatrix = useMemo(()=>{
    const m: Record<string, Record<number, number>> = {};
    for (const s of slots) {
      if (!m[s.date]) m[s.date] = {};
      m[s.date][s.hour] = s.freeLanes;
    }
    return m;
  }, [slots]);

  function showPopup(x:number,y:number,val:number,h:number,isBreak:boolean){
    setPopup({ left:x-60, top:y-100, value:val, hour:h, isBreak });
  }
  function hidePopup(){
    if (popupTimeout.current) clearTimeout(popupTimeout.current);
    popupTimeout.current = window.setTimeout(()=>setPopup(null),350);
  }
  function cancelHide(){
    if (popupTimeout.current) clearTimeout(popupTimeout.current);
  }

  const chartWidth =
    LEFT_PADDING*2 +
    hourColumns.length * (BAR_WIDTH + BAR_GAP) -
    BAR_GAP;
  const chartHeight =
    TOP_PADDING + (SEGMENT_HEIGHT + SEGMENT_GAP) * TOTAL_LANES + 60;

  const current = currentNow?.current ?? null;
  const totalPlaces = TOTAL_LANES * LANE_CAPACITY;
  const freePlaces = current == null ? "—" : Math.max(0, totalPlaces - current);

  let sourceNote = "";
  if (currentNow) {
    if (currentNow.source === "previousHour") sourceNote = "данные предыдущего часа";
    else if (currentNow.source === "none") sourceNote = "нет данных";
    else if (currentNow.source === "error") sourceNote = "ошибка";
  }

  return (
    <div className="pool-root">
      <div className="pool-current-card">
        <div className="pool-current-card-title">
          Сейчас в тренировочном
          <br /> бассейне:&nbsp;
          <span style={{ fontWeight: 900 }}>{current == null ? "—" : current}</span>
          <br />
          <span style={{ display:"inline-block", marginTop:42 }}>
            Свободно мест:&nbsp;
            <span style={{ fontWeight:900 }}>{freePlaces}</span>
            {sourceNote && (
              <span
                style={{
                  display:"block",
                  marginTop:28,
                  fontSize:20,
                  fontWeight:600,
                  color:"#1b6aa5"
                }}
              >
                {sourceNote}
              </span>
            )}
          </span>
          <div>
            <button className="refresh-btn" onClick={fetchData} disabled={loading}>
              {loading ? "..." : "Обновить"}
            </button>
          </div>
        </div>
      </div>

      <div className="pool-chart-panel">
        <div className="pool-dates-row">
          {dates.map((d, idx)=>{
            const active = idx === selectedIdx;
            return (
              <div
                key={d}
                className={"pool-date-chip"+(active?" pool-date-chip-active":"")}
                onClick={()=>setSelectedIdx(idx)}
              >
                <div
                  style={{
                    fontWeight: active?900:700,
                    fontSize: active?26:22,
                    marginBottom:4
                  }}
                >{formatDateShortRu(d)}</div>
                <div
                  style={{
                    fontSize: active?21:19,
                    fontWeight:700,
                    letterSpacing: ".01em"
                  }}
                >{getWeekdayRu(d)}</div>
              </div>
            );
          })}
        </div>

        <div className="pool-chart-title">Свободные дорожки</div>

        <div style={{ position:'relative', height:42, marginBottom:2 }}>
          <div
            className="pool-hour-values-row"
            style={{
              left:LEFT_PADDING,
              right:LEFT_PADDING,
              position:'absolute',
              width: chartWidth - LEFT_PADDING * 2
            }}
          >
            {hourColumns.map(h=>{
              let val = freeMatrix[dates[selectedIdx]]?.[h] ?? 0;
              if (isBreakHour(dates[selectedIdx], h)) val = 0;
              return (
                <span key={h} style={{ width:BAR_WIDTH, textAlign:'center' }}>
                  {val}
                </span>
              );
            })}
          </div>
        </div>

        <div
          ref={scrollRef}
          style={{
            position:'relative',
            minWidth:'100%',
            maxWidth:chartWidth,
            margin:'0 auto',
            overflowX:'auto'
          }}
        >
          <div style={{ width:chartWidth, minWidth:chartWidth }}>
            <svg
              width={chartWidth}
              height={chartHeight}
              style={{ display:'block' }}
            >
              {hourColumns.map((h, hourIdx)=>{
                const date = dates[selectedIdx];
                let val = freeMatrix[date]?.[h] ?? 0;
                const br = isBreakHour(date,h);
                if (br) val = 0;
                const x = LEFT_PADDING + hourIdx*(BAR_WIDTH+BAR_GAP);
                return (
                  <g key={h}>
                    {Array.from({length:TOTAL_LANES}, (_, segIdx)=>{
                      const segY = TOP_PADDING + segIdx*(SEGMENT_HEIGHT+SEGMENT_GAP);
                      if (br) {
                        return (
                          <rect
                            key={segIdx}
                            x={x}
                            y={segY}
                            width={BAR_WIDTH}
                            height={SEGMENT_HEIGHT}
                            rx={6}
                            fill={INACTIVE_COLOR}
                          />
                        );
                      }
                      const active = segIdx >= TOTAL_LANES - val;
                      const tcol = val>1 ? (segIdx - (TOTAL_LANES - val))/(val-1) : 0;
                      return (
                        <rect
                          key={segIdx}
                          x={x}
                          y={segY}
                          width={BAR_WIDTH}
                          height={SEGMENT_HEIGHT}
                          rx={6}
                          fill={active ? lerpColor(COLOR_TOP,COLOR_BOTTOM,tcol) : INACTIVE_COLOR}
                          style={{ cursor: active ? "pointer":"default" }}
                          onMouseEnter={active?()=>showPopup(x+BAR_WIDTH/2, segY, val, h, br):undefined}
                          onMouseLeave={hidePopup}
                          onMouseMove={cancelHide}
                        />
                      );
                    })}
                    {br && (
                      <text
                        x={x + BAR_WIDTH/2}
                        y={TOP_PADDING + (TOTAL_LANES*(SEGMENT_HEIGHT+SEGMENT_GAP))/2}
                        textAnchor="middle"
                        fill="#185a90"
                        fontWeight={700}
                        fontSize={21}
                        style={{ writingMode:'vertical-rl', userSelect:'none', letterSpacing:'.12em' }}
                      >ПЕРЕРЫВ</text>
                    )}
                  </g>
                );
              })}
              {hourColumns.map(h=>{
                const x = LEFT_PADDING + (h - HOUR_START)*(BAR_WIDTH+BAR_GAP);
                return (
                  <text
                    key={'h-'+h}
                    x={x + BAR_WIDTH/2}
                    y={TOP_PADDING + (SEGMENT_HEIGHT+SEGMENT_GAP)*TOTAL_LANES + 46}
                    textAnchor="middle"
                    fill="#185a90"
                    fontWeight={700}
                    fontSize={26}
                  >{h}:00</text>
                );
              })}
            </svg>
            {popup && <Popup {...popup} />}
          </div>
        </div>

        <div className="pool-scroll-buttons">
          <button
            className="pool-scroll-btn"
            onClick={()=>{ if(scrollRef.current) scrollRef.current.scrollLeft -= 180; }}
          >◀</button>
          <button
            className="pool-scroll-btn"
            onClick={()=>{ if(scrollRef.current) scrollRef.current.scrollLeft += 180; }}
          >▶</button>
        </div>
      </div>

      {loading && (
        <div className="pool-loading-overlay">
          <div className="pool-spinner" />
          <p style={{ color:'#185a90', fontWeight:700 }}>Загрузка данных...</p>
        </div>
      )}
      {error && <div className="pool-error">Ошибка: {error}</div>}
    </div>
  );
};

export default PoolWorkload;