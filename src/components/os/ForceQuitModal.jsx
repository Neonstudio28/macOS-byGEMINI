import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { X, AlertTriangle, XCircle } from 'lucide-react';
import { APP_CONFIGS } from '../../utils/initialData';

export const ForceQuitModal = () => {
  const { windows, forceQuitOpen, setForceQuitOpen, closeWindow, addNotification } = useOS();
  const [selectedAppId, setSelectedAppId] = useState(windows[0]?.id || null);

  if (!forceQuitOpen) return null;

  const handleForceQuit = () => {
    if (selectedAppId) {
      const win = windows.find(w => w.id === selectedAppId);
      closeWindow(selectedAppId);
      addNotification('Force Quit', `Force quit ${win?.title || 'Application'}`);
      setSelectedAppId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9500] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 select-none font-sans text-xs text-white">
      <div className="w-96 rounded-2xl macos-glass p-5 border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle size={18} />
            <span>Force Quit Applications</span>
          </div>
          <button onClick={() => setForceQuitOpen(false)} className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white">
            <X size={14} />
          </button>
        </div>

        <p className="text-white/70 text-[11px] leading-relaxed">
          If an application doesn't respond for a while, select its name and click Force Quit.
        </p>

        {/* Apps List */}
        <div className="h-44 bg-black/40 border border-white/15 rounded-xl p-2 overflow-auto space-y-1">
          {windows.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/40 italic">No running applications</div>
          ) : (
            windows.map(win => {
              const isSel = selectedAppId === win.id;
              const config = APP_CONFIGS[win.appKey];
              return (
                <button
                  key={win.id}
                  onClick={() => setSelectedAppId(win.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    isSel ? 'bg-[#007AFF] text-white font-bold' : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  <span className="truncate">{config?.title || win.title}</span>
                  <span className="text-[10px] opacity-60 font-mono">PID {win.id.slice(0, 4)}</span>
                </button>
              );
            })
          )}
        </div>

        <div className="text-[10px] text-white/40 italic">
          You can open this window anytime by pressing <strong className="text-white">Option + Command + Esc</strong>.
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
          <button 
            onClick={() => setForceQuitOpen(false)} 
            className="px-4 py-1.5 rounded-md bg-white/10 hover:bg-white/20 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleForceQuit}
            disabled={!selectedAppId || windows.length === 0}
            className="px-4 py-1.5 rounded-md bg-rose-500 hover:bg-rose-600 font-bold transition-colors shadow-lg disabled:opacity-40"
          >
            Force Quit
          </button>
        </div>
      </div>
    </div>
  );
};
