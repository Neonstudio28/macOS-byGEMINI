import React, { useState, useEffect, useRef } from 'react';
import { Cpu, MemoryStick, HardDrive, Wifi, Battery, RefreshCw, ChevronUp, ChevronDown, X, Square } from 'lucide-react';

function randRange(min, max) { return Math.random() * (max - min) + min; }

const INITIAL_PROCESSES = [
  { pid: 1,    name: 'kernel_task',       user: 'root',  cpu: 0.1, mem: 2100, status: 'running', icon: '⚙️' },
  { pid: 143,  name: 'WindowServer',      user: 'alex',  cpu: 3.2, mem: 892,  status: 'running', icon: '🖥️' },
  { pid: 267,  name: 'Safari',            user: 'alex',  cpu: 1.8, mem: 520,  status: 'running', icon: '🧭' },
  { pid: 318,  name: 'Messages',          user: 'alex',  cpu: 0.4, mem: 210,  status: 'running', icon: '💬' },
  { pid: 402,  name: 'Music',             user: 'alex',  cpu: 2.1, mem: 310,  status: 'running', icon: '🎵' },
  { pid: 489,  name: 'Photos',            user: 'alex',  cpu: 0.8, mem: 445,  status: 'running', icon: '🖼️' },
  { pid: 512,  name: 'Mail',              user: 'alex',  cpu: 0.3, mem: 185,  status: 'running', icon: '✉️' },
  { pid: 601,  name: 'Finder',            user: 'alex',  cpu: 0.6, mem: 128,  status: 'running', icon: '🗂️' },
  { pid: 712,  name: 'SystemUIServer',    user: 'alex',  cpu: 0.2, mem: 76,   status: 'running', icon: '🔧' },
  { pid: 823,  name: 'Spotlight',         user: 'alex',  cpu: 0.1, mem: 58,   status: 'idle',    icon: '🔍' },
  { pid: 934,  name: 'mds_stores',        user: 'root',  cpu: 1.2, mem: 340,  status: 'running', icon: '📦' },
  { pid: 1045, name: 'Notes',             user: 'alex',  cpu: 0.2, mem: 145,  status: 'running', icon: '📝' },
  { pid: 1156, name: 'FaceTime',          user: 'alex',  cpu: 0.4, mem: 230,  status: 'running', icon: '📹' },
  { pid: 1267, name: 'com.apple.CoreAudio',user:'root',  cpu: 0.8, mem: 92,   status: 'running', icon: '🔊' },
  { pid: 1378, name: 'Contacts',          user: 'alex',  cpu: 0.1, mem: 88,   status: 'idle',    icon: '👤' },
];

const TABS = [
  { id: 'cpu', label: 'CPU', icon: Cpu },
  { id: 'memory', label: 'Memory', icon: MemoryStick },
  { id: 'energy', label: 'Energy', icon: Battery },
  { id: 'disk', label: 'Disk', icon: HardDrive },
  { id: 'network', label: 'Network', icon: Wifi },
];

const SparkLine = ({ data, color }) => {
  const w = 80, h = 30;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 2)}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

export const ValActivityMonitor = () => {
  const [activeTab, setActiveTab] = useState('cpu');
  const [processes, setProcesses] = useState(INITIAL_PROCESSES.map(p => ({ ...p })));
  const [selectedPid, setSelectedPid] = useState(null);
  const [sortCol, setSortCol] = useState('cpu');
  const [sortDir, setSortDir] = useState('desc');
  const [searchQ, setSearchQ] = useState('');
  const [cpuHistory, setCpuHistory] = useState(Array(20).fill(0).map(() => randRange(8, 25)));
  const [memHistory, setMemHistory] = useState(Array(20).fill(0).map(() => randRange(55, 70)));
  const [netHistory, setNetHistory] = useState(Array(20).fill(0).map(() => randRange(10, 80)));
  const tickRef = useRef(0);

  // Animate metrics
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current++;
      // Update process CPU/mem values
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0, Math.min(99, p.cpu + randRange(-0.5, 0.5))),
        mem: Math.max(20, p.mem + randRange(-10, 10)),
      })));
      const newCpu = randRange(8, 35);
      const newMem = randRange(55, 75);
      setCpuHistory(h => [...h.slice(1), newCpu]);
      setMemHistory(h => [...h.slice(1), newMem]);
      setNetHistory(h => [...h.slice(1), randRange(5, 120)]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalCpu = processes.reduce((s, p) => s + p.cpu, 0).toFixed(1);
  const totalMem = processes.reduce((s, p) => s + p.mem, 0);
  const memGB = (totalMem / 1024).toFixed(2);
  const memUsedPct = Math.round((totalMem / (32 * 1024)) * 100);

  const sorted = [...processes]
    .filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.user.toLowerCase().includes(searchQ.toLowerCase()))
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1;
      if (sortCol === 'name') return mult * a.name.localeCompare(b.name);
      return mult * (a[sortCol] - b[sortCol]);
    });

  const handleSort = col => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => sortCol === col ? (sortDir === 'desc' ? <ChevronDown size={11} /> : <ChevronUp size={11} />) : null;

  const selectedProc = processes.find(p => p.pid === selectedPid);

  return (
    <div className="flex flex-col h-full w-full bg-[#1C1C1E] text-white select-none font-sans text-xs overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8 bg-white/3 flex-shrink-0">
        {/* Tabs */}
        <div className="flex items-center rounded-xl bg-white/5 p-0.5 gap-0.5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                activeTab === tab.id ? 'bg-[#007AFF] text-white shadow' : 'text-white/50 hover:text-white'
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        {/* Quit button */}
        {selectedPid && (
          <button
            onClick={() => { setProcesses(p => p.filter(x => x.pid !== selectedPid)); setSelectedPid(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-[11px] font-semibold hover:bg-rose-500 hover:text-white transition-all"
          >
            <X size={12} /> Force Quit
          </button>
        )}
        {/* Search */}
        <input
          type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
          placeholder="Filter processes..."
          className="w-44 px-3 py-1.5 rounded-lg bg-white/8 border border-white/10 text-[11px] text-white placeholder-white/30 focus:outline-none focus:border-[#007AFF]"
        />
      </div>

      {/* Process list */}
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[500px]">
          <thead className="sticky top-0 bg-[#1C1C1E]/90 backdrop-blur-sm border-b border-white/5 z-10">
            <tr>
              {[
                { id: 'name', label: 'Process Name', w: 'flex-1' },
                { id: 'cpu', label: `CPU (${totalCpu}%)`, w: 'w-24' },
                { id: 'mem', label: `Memory (${memGB} GB)`, w: 'w-28' },
                { id: 'pid', label: 'PID', w: 'w-16' },
                { id: 'user', label: 'User', w: 'w-20' },
                { id: 'status', label: 'Status', w: 'w-20' },
              ].map(col => (
                <th
                  key={col.id}
                  onClick={() => handleSort(col.id)}
                  className="px-3 py-2 text-left text-[10px] font-bold text-white/30 uppercase tracking-wide cursor-pointer hover:text-white/60 select-none"
                >
                  <span className="flex items-center gap-1">{col.label} <SortIcon col={col.id} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => (
              <tr
                key={p.pid}
                onClick={() => setSelectedPid(s => s === p.pid ? null : p.pid)}
                className={`border-b border-white/3 cursor-pointer transition-colors ${
                  selectedPid === p.pid ? 'bg-[#007AFF]/15' : 'hover:bg-white/5'
                }`}
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{p.icon}</span>
                    <span className={`font-semibold ${selectedPid === p.pid ? 'text-[#007AFF]' : 'text-white'}`}>{p.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${p.cpu > 30 ? 'bg-rose-500' : p.cpu > 15 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.min(100, p.cpu)}%` }}
                      />
                    </div>
                    <span className="text-white/60 font-mono w-10">{p.cpu.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-white/60 font-mono">{p.mem >= 1024 ? `${(p.mem/1024).toFixed(1)} GB` : `${Math.round(p.mem)} MB`}</td>
                <td className="px-3 py-2 text-white/40 font-mono">{p.pid}</td>
                <td className="px-3 py-2 text-white/50">{p.user}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${p.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom stats */}
      <div className="flex-shrink-0 border-t border-white/8 px-4 py-3 flex items-center gap-6 bg-[#252528]/80 backdrop-blur-md">
        {/* CPU Chart */}
        <div className="flex items-center gap-3">
          <SparkLine data={cpuHistory} color="#34d399" />
          <div>
            <div className="text-[9px] text-white/40 uppercase font-bold tracking-wide">CPU</div>
            <div className="text-sm font-black text-emerald-400">{cpuHistory[cpuHistory.length-1].toFixed(1)}%</div>
          </div>
        </div>
        <div className="w-px h-8 bg-white/10" />
        {/* Memory Chart */}
        <div className="flex items-center gap-3">
          <SparkLine data={memHistory} color="#818cf8" />
          <div>
            <div className="text-[9px] text-white/40 uppercase font-bold tracking-wide">Memory</div>
            <div className="text-sm font-black text-violet-400">{memHistory[memHistory.length-1].toFixed(0)}%</div>
          </div>
        </div>
        <div className="w-px h-8 bg-white/10" />
        {/* Net */}
        <div className="flex items-center gap-3">
          <SparkLine data={netHistory} color="#38bdf8" />
          <div>
            <div className="text-[9px] text-white/40 uppercase font-bold tracking-wide">Network</div>
            <div className="text-sm font-black text-sky-400">{netHistory[netHistory.length-1].toFixed(0)} KB/s</div>
          </div>
        </div>
        <div className="flex-1" />
        <div className="text-[10px] text-white/30">{sorted.length} of {processes.length} processes</div>
      </div>
    </div>
  );
};
