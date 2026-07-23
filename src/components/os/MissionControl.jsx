import React from 'react';
import { useOS } from '../../context/OSContext';
import { LayoutGrid, X, Maximize2 } from 'lucide-react';
import { APP_CONFIGS } from '../../utils/initialData';

export const MissionControl = () => {
  const { windows, focusWindow, closeWindow, missionControlOpen, setMissionControlOpen } = useOS();

  if (!missionControlOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-2xl p-8 flex flex-col justify-between select-none animate-in fade-in duration-200"
      onClick={() => setMissionControlOpen(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-base">
          <LayoutGrid size={22} />
          <span>Mission Control — All Windows</span>
        </div>
        <button 
          onClick={() => setMissionControlOpen(false)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Windows Grid View */}
      <div className="flex-1 my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center justify-center overflow-auto p-4">
        {windows.length === 0 ? (
          <div className="col-span-full text-center text-slate-500 text-sm">No windows active</div>
        ) : (
          windows.map((win) => {
            const config = APP_CONFIGS[win.appKey];
            return (
              <div
                key={win.id}
                onClick={(e) => {
                  e.stopPropagation();
                  focusWindow(win.id);
                  setMissionControlOpen(false);
                }}
                className="h-48 rounded-2xl glass-window p-3 cursor-pointer hover:border-cyan-400 hover:scale-105 transition-all flex flex-col justify-between border border-white/20 shadow-2xl relative group"
              >
                {/* Title */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-xs text-white truncate">{win.title}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                    className="p-1 rounded hover:bg-rose-500/30 text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>

                {/* Window Thumbnail Preview */}
                <div className="flex-1 my-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-slate-400 font-mono text-xs">
                  {config?.title} Frame
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="text-center text-xs text-slate-400 font-mono">
        Click any window frame to bring it to foreground.
      </div>
    </div>
  );
};
