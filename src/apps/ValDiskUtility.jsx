import React, { useState, useEffect } from 'react';
import { HardDrive, RefreshCw, AlertTriangle, CheckCircle2, Info, ChevronRight, Trash2, Zap } from 'lucide-react';

const VOLUMES = [
  { id: 'v1', name: 'Macintosh HD', type: 'APFS', icon: '💻', total: 1000, used: 382, healthy: true, system: true },
  { id: 'v2', name: 'Macintosh HD - Data', type: 'APFS', icon: '🗂️', total: 1000, used: 621, healthy: true, system: false },
  { id: 'v3', name: 'Recovery', type: 'APFS Recovery', icon: '🔧', total: 5.2, used: 2.8, healthy: true, system: true },
];

const ProgressBar = ({ value, max, color = 'bg-[#007AFF]' }) => (
  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
    <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
  </div>
);

export const ValDiskUtility = () => {
  const [selected, setSelected] = useState(VOLUMES[0]);
  const [running, setRunning] = useState(null); // 'verify' | 'repair' | 'firstaid'
  const [log, setLog] = useState([]);
  const [eraseOpen, setEraseOpen] = useState(false);

  const runFirstAid = (action) => {
    if (running) return;
    setRunning(action);
    setLog([`Starting ${action} on "${selected.name}"...`]);
    const steps = [
      `Checking catalog file...`,
      `Checking extent file...`,
      `Checking volume bitmap...`,
      `Checking volume information...`,
      `Checking multi-linked files...`,
      action === 'repair' ? `Repairing volume... done.` : `Verification complete.`,
      `No issues found on "${selected.name}".`,
      `${action === 'repair' ? 'Repair' : 'First Aid'} completed successfully.`,
    ];
    steps.forEach((step, i) => {
      setTimeout(() => {
        setLog(prev => [...prev, step]);
        if (i === steps.length - 1) setRunning(null);
      }, (i + 1) * 600);
    });
  };

  const freeGB = (v) => (v.total - v.used).toFixed(1);
  const usedPct = (v) => Math.round((v.used / v.total) * 100);
  const color = (v) => usedPct(v) > 85 ? 'bg-rose-500' : usedPct(v) > 65 ? 'bg-amber-400' : 'bg-[#007AFF]';

  return (
    <div className="flex h-full w-full bg-[#1C1C1E] text-white select-none font-sans text-xs overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 border-r border-white/8 bg-[#252528]/90 flex flex-col">
        <div className="px-3 py-2.5 border-b border-white/8 flex items-center gap-2">
          <HardDrive size={14} className="text-[#007AFF]" />
          <span className="font-bold text-sm">Disk Utility</span>
        </div>
        <div className="flex-1 p-2 overflow-y-auto space-y-0.5">
          <div className="px-2 py-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">Internal</div>
          {VOLUMES.map(v => (
            <button
              key={v.id}
              onClick={() => { setSelected(v); setLog([]); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors ${
                selected.id === v.id ? 'bg-[#007AFF] text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span className="text-base">{v.icon}</span>
              <div className="text-left min-w-0">
                <div className="font-semibold truncate">{v.name}</div>
                <div className={`text-[9px] mt-0.5 ${selected.id === v.id ? 'text-white/70' : 'text-white/40'}`}>{v.type}</div>
              </div>
              {v.healthy && <CheckCircle2 size={11} className={`ml-auto flex-shrink-0 ${selected.id === v.id ? 'text-emerald-300' : 'text-emerald-400'}`} />}
            </button>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-white/8 flex items-center gap-2 bg-white/3">
          <button
            onClick={() => runFirstAid('firstaid')}
            disabled={!!running}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              running ? 'opacity-50 cursor-not-allowed bg-white/5' : 'bg-[#007AFF]/20 text-[#007AFF] hover:bg-[#007AFF] hover:text-white'
            }`}
          >
            <Zap size={13} />
            {running === 'firstaid' ? 'Running...' : 'First Aid'}
          </button>
          <button
            onClick={() => setEraseOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-white/60 hover:bg-rose-500/20 hover:text-rose-400 transition-all"
          >
            <Trash2 size={13} /> Erase
          </button>
          <button
            onClick={() => runFirstAid('verify')}
            disabled={!!running}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-white/60 hover:bg-white/15 hover:text-white transition-all"
          >
            <RefreshCw size={13} className={running === 'verify' ? 'animate-spin' : ''} /> Verify
          </button>
          <div className="flex-1" />
          <span className="text-[10px] text-white/30 font-mono">macOS 26 Tahoe</span>
        </div>

        {/* Volume info */}
        <div className="flex-1 overflow-auto p-5 space-y-5">
          <div className="flex items-start gap-5">
            <div className="text-5xl">{selected.icon}</div>
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-bold text-white">{selected.name}</h2>
              <div className="text-white/50">{selected.type} • {selected.total >= 100 ? `${selected.total} GB` : `${selected.total} GB`} Total</div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selected.healthy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {selected.healthy ? '● Healthy' : '● Degraded'}
                </span>
                {selected.system && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400">System Volume</span>}
              </div>
            </div>
          </div>

          {/* Storage chart */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-3">
            <div className="font-bold text-white">Storage Overview</div>
            <ProgressBar value={selected.used} max={selected.total} color={color(selected)} />
            <div className="flex justify-between text-[11px]">
              <span className="text-white/60">{selected.used} GB Used</span>
              <span className="text-white/60">{freeGB(selected)} GB Free</span>
            </div>
            {/* Breakdown bars */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: 'System', gb: selected.system ? 14.2 : 0, color: 'bg-slate-500' },
                { label: 'Apps', gb: selected.used * 0.35, color: 'bg-blue-500' },
                { label: 'Documents', gb: selected.used * 0.25, color: 'bg-purple-500' },
                { label: 'Photos', gb: selected.used * 0.15, color: 'bg-rose-400' },
                { label: 'Music', gb: selected.used * 0.10, color: 'bg-pink-500' },
                { label: 'Other', gb: selected.used * 0.15, color: 'bg-amber-500' },
              ].filter(s => s.gb > 0).map(s => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/60">{s.label}</span>
                    <span className="text-white/40 font-mono">{s.gb.toFixed(1)} GB</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.gb / selected.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info grid */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-2.5">
            <div className="font-bold text-white">Volume Details</div>
            {[
              ['Format', selected.type],
              ['Capacity', `${selected.total} GB (${(selected.total * 1e9).toLocaleString()} bytes)`],
              ['Available', `${freeGB(selected)} GB`],
              ['Used', `${selected.used} GB (${usedPct(selected)}%)`],
              ['Mount Point', selected.system ? '/System/Volumes/Data' : '/'],
              ['Owner', selected.system ? 'Enabled' : 'Not Applicable'],
              ['Permissions Enabled', 'Yes'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-white/50">{k}</span>
                <span className="text-white font-mono">{v}</span>
              </div>
            ))}
          </div>

          {/* Log output */}
          {log.length > 0 && (
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] space-y-0.5 max-h-40 overflow-y-auto">
              {log.map((line, i) => (
                <div key={i} className={i === log.length - 1 && running ? 'text-amber-300' : 'text-emerald-400'}>
                  {line}
                </div>
              ))}
              {running && <div className="text-amber-300 animate-pulse">▮</div>}
            </div>
          )}
        </div>
      </div>

      {/* Erase dialog */}
      {eraseOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2C2C2E] border border-white/15 rounded-2xl p-6 shadow-2xl w-80 space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="text-amber-400 flex-shrink-0" />
              <div>
                <div className="font-bold text-white">Erase "{selected.name}"?</div>
                <div className="text-xs text-white/50 mt-0.5">This will permanently erase all data.</div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEraseOpen(false)} className="px-4 py-2 rounded-lg bg-white/10 text-xs font-semibold text-white hover:bg-white/20">Cancel</button>
              <button onClick={() => setEraseOpen(false)} className="px-4 py-2 rounded-lg bg-rose-500 text-xs font-bold text-white hover:bg-rose-400">Erase</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
