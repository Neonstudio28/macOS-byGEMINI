import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  X, 
  Clock, 
  Sun, 
  Battery, 
  Activity, 
  Calendar, 
  FileText, 
  Check, 
  Sparkles,
  Plus
} from 'lucide-react';

export const WidgetPanel = () => {
  const { widgetPanelOpen, setWidgetPanelOpen, openApp } = useOS();
  const [quickNote, setQuickNote] = useState('Draft ideas for macOS Tahoe keynote...');

  if (!widgetPanelOpen) return null;

  return (
    <div className="fixed top-7 right-3 bottom-16 z-[9100] w-88 macos-glass rounded-2xl p-4 border border-white/20 shadow-2xl overflow-auto space-y-4 animate-in fade-in slide-in-from-right-5 duration-200 select-none text-xs text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 font-bold text-white">
          <Sparkles size={16} className="text-cyan-400" />
          <span>macOS Glass Widgets</span>
        </div>
        <button onClick={() => setWidgetPanelOpen(false)} className="p-1 hover:bg-white/15 rounded-full text-white/60 hover:text-white">
          <X size={14} />
        </button>
      </div>

      {/* World Clock Widget */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-white/60 font-medium">
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-sky-400" /> World Clock</span>
          <span className="text-[10px] font-mono">4 Cities</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center pt-1">
          <div className="p-2 rounded-xl bg-black/30 border border-white/10">
            <div className="font-bold text-sm text-white">Lake Tahoe</div>
            <div className="text-[10px] text-sky-300 font-mono">10:45 AM</div>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-white/10">
            <div className="font-bold text-sm text-white">Cupertino</div>
            <div className="text-[10px] text-sky-300 font-mono">10:45 AM</div>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-white/10">
            <div className="font-bold text-sm text-white">London</div>
            <div className="text-[10px] text-sky-300 font-mono">6:45 PM</div>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-white/10">
            <div className="font-bold text-sm text-white">Tokyo</div>
            <div className="text-[10px] text-sky-300 font-mono">2:45 AM</div>
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="p-4 rounded-2xl bg-gradient-to-tr from-sky-900 via-indigo-900 to-slate-900 border border-white/15 space-y-2 shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold text-sm text-white">Lake Tahoe</div>
            <div className="text-3xl font-extralight text-white mt-1">68°F</div>
          </div>
          <Sun size={32} className="text-amber-400 animate-spin" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-300 pt-2 border-t border-white/10">
          <span>H: 72° L: 54°</span>
          <span className="text-emerald-400 font-semibold">AQI 24 — Excellent</span>
        </div>
      </div>

      {/* Calendar & Battery Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Calendar Widget */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="text-rose-400 font-bold text-xs uppercase tracking-wider">TUESDAY</div>
          <div className="text-4xl font-black text-white my-1">22</div>
          <div className="text-[10px] text-white/50">JULY 2026</div>
        </div>

        {/* Battery Widget */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex justify-between items-center text-emerald-400 font-bold">
            <Battery size={16} />
            <span className="text-xs">98%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
            <div className="bg-emerald-400 h-full w-[98%]" />
          </div>
          <div className="text-[10px] text-white/50">MacBook Pro M4</div>
        </div>
      </div>

      {/* Quick Note Widget */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="flex justify-between items-center text-amber-400 font-bold">
          <span className="flex items-center gap-1.5"><FileText size={14} /> Quick Note</span>
          <button onClick={() => openApp('notes')} className="text-[10px] underline text-white/60 hover:text-white">Open Notes</button>
        </div>
        <textarea 
          value={quickNote}
          onChange={(e) => setQuickNote(e.target.value)}
          rows={3}
          className="w-full p-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none resize-none font-sans"
        />
      </div>
    </div>
  );
};
