import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Sun, 
  Battery, 
  Calendar, 
  TrendingUp, 
  CheckSquare, 
  Square, 
  X, 
  Activity,
  Sparkles
} from 'lucide-react';
import { sounds } from '../../utils/soundEngine';

export const AnalogClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const secDeg = (time.getSeconds() / 60) * 360;
  const minDeg = (time.getMinutes() / 60) * 360;
  const hrDeg = ((time.getHours() % 12) / 12) * 360 + (time.getMinutes() / 60) * 30;

  return (
    <div className="w-36 h-36 rounded-3xl macos-glass p-3 flex flex-col items-center justify-center relative border border-white/20 shadow-2xl">
      <div className="w-28 h-28 rounded-full border-2 border-white/20 relative flex items-center justify-center bg-black/40">
        {/* Hour Hand */}
        <div 
          className="absolute w-1 bg-white rounded-full origin-bottom"
          style={{ height: '24px', top: '20px', transform: `rotate(${hrDeg}deg)` }}
        />
        {/* Minute Hand */}
        <div 
          className="absolute w-0.5 bg-white/90 rounded-full origin-bottom"
          style={{ height: '34px', top: '10px', transform: `rotate(${minDeg}deg)` }}
        />
        {/* Second Hand */}
        <div 
          className="absolute w-0.5 bg-rose-500 rounded-full origin-bottom z-10"
          style={{ height: '38px', top: '6px', transform: `rotate(${secDeg}deg)` }}
        />
        {/* Center Dot */}
        <div className="w-2 h-2 rounded-full bg-white z-20" />
      </div>
      <span className="text-[10px] text-white/60 font-mono mt-1 font-semibold">CUPERTINO</span>
    </div>
  );
};

export const WeatherWidget = () => {
  return (
    <div className="w-72 h-36 rounded-3xl bg-gradient-to-tr from-sky-900 via-indigo-900 to-slate-950 p-4 border border-white/20 shadow-2xl flex flex-col justify-between select-none">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-xs text-white">Lake Tahoe</h4>
          <div className="text-3xl font-extralight text-white mt-0.5">68°</div>
          <span className="text-[10px] text-sky-300 font-medium">Mostly Sunny</span>
        </div>
        <Sun size={36} className="text-amber-400 animate-spin" />
      </div>
      <div className="flex justify-between items-center text-[10px] text-white/70 border-t border-white/10 pt-2 font-mono">
        <span>H: 72° L: 54°</span>
        <span>AQI 24 (Good)</span>
      </div>
    </div>
  );
};

export const RemindersWidget = () => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Finish macOS Tahoe Keynote', done: true },
    { id: '2', title: 'Review Liquid Glass Shaders', done: false },
    { id: '3', title: 'Sync with Maya Chen at 4 PM', done: false }
  ]);

  const toggleTask = (id) => {
    sounds.playClick();
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="w-72 h-36 rounded-3xl macos-glass p-3.5 border border-white/20 shadow-2xl flex flex-col justify-between select-none">
      <div className="flex justify-between items-center text-amber-400 font-bold text-xs">
        <span className="flex items-center gap-1.5"><CheckSquare size={14} /> Reminders</span>
        <span className="text-[10px] text-white/40">{tasks.filter(t => !t.done).length} left</span>
      </div>

      <div className="space-y-1.5 my-1">
        {tasks.map(t => (
          <button
            key={t.id}
            onClick={() => toggleTask(t.id)}
            className="w-full flex items-center gap-2 text-left text-[11px] text-white/90 hover:text-white transition-colors"
          >
            {t.done ? (
              <CheckSquare size={13} className="text-amber-400 shrink-0" />
            ) : (
              <Square size={13} className="text-white/40 shrink-0" />
            )}
            <span className={t.done ? 'line-through text-white/40' : ''}>{t.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const StocksWidget = () => {
  const stocks = [
    { symbol: 'AAPL', price: '$234.50', change: '+2.4%', up: true },
    { symbol: 'GOOGL', price: '$182.10', change: '+1.8%', up: true },
    { symbol: 'MSFT', price: '$448.20', change: '+0.9%', up: true }
  ];

  return (
    <div className="w-72 h-36 rounded-3xl macos-glass p-3.5 border border-white/20 shadow-2xl flex flex-col justify-between select-none">
      <div className="flex justify-between items-center text-emerald-400 font-bold text-xs">
        <span className="flex items-center gap-1.5"><TrendingUp size={14} /> Stocks Ticker</span>
        <span className="text-[10px] text-white/40 font-mono">MARKET OPEN</span>
      </div>

      <div className="space-y-1">
        {stocks.map(s => (
          <div key={s.symbol} className="flex justify-between items-center text-xs border-b border-white/5 pb-1">
            <span className="font-bold text-white">{s.symbol}</span>
            <span className="font-mono text-white/80">{s.price}</span>
            <span className="font-mono font-bold text-emerald-400 text-[10px]">{s.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BatteryWidget = () => {
  return (
    <div className="w-36 h-36 rounded-3xl macos-glass p-3 flex flex-col justify-between border border-white/20 shadow-2xl select-none">
      <div className="flex justify-between items-center text-emerald-400 font-bold text-xs">
        <Battery size={16} />
        <span>98%</span>
      </div>

      <div className="space-y-1 text-[10px] text-white/70">
        <div className="flex justify-between">
          <span>MacBook Pro</span>
          <span className="font-bold text-emerald-400">98%</span>
        </div>
        <div className="flex justify-between">
          <span>AirPods Max</span>
          <span className="font-bold text-emerald-400">85%</span>
        </div>
        <div className="flex justify-between">
          <span>Magic Keyboard</span>
          <span className="font-bold text-emerald-400">90%</span>
        </div>
      </div>
    </div>
  );
};

export const DesktopWidgetRenderer = ({ widget, onRemove }) => {
  const renderWidgetBody = () => {
    switch (widget.type) {
      case 'clock': return <AnalogClockWidget />;
      case 'weather': return <WeatherWidget />;
      case 'reminders': return <RemindersWidget />;
      case 'stocks': return <StocksWidget />;
      case 'battery': return <BatteryWidget />;
      default: return <AnalogClockWidget />;
    }
  };

  return (
    <div className="relative group">
      {/* Remove Badge */}
      <button 
        onClick={() => onRemove(widget.id)}
        className="absolute -top-2 -left-2 z-30 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        title="Remove Widget"
      >
        <X size={12} />
      </button>

      {renderWidgetBody()}
    </div>
  );
};
