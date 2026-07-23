import React from 'react';
import { useOS } from '../../context/OSContext';
import { APP_CONFIGS } from '../../utils/initialData';
import { sounds } from '../../utils/soundEngine';

export const StageManager = ({ enabled }) => {
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useOS();

  if (!enabled || windows.length <= 1) return null;

  // Group inactive windows by appKey for Stage Manager left rail
  const inactiveWindows = windows.filter(w => w.id !== activeWindowId && !w.isMinimized);

  if (inactiveWindows.length === 0) return null;

  const handleStageClick = (winId) => {
    sounds.playClick();
    focusWindow(winId);
  };

  return (
    <div className="fixed left-3 top-16 bottom-20 z-20 flex flex-col justify-center gap-3 select-none pointer-events-auto">
      {inactiveWindows.map(win => {
        const config = APP_CONFIGS[win.appKey];
        return (
          <div
            key={win.id}
            onClick={() => handleStageClick(win.id)}
            className="w-28 h-20 rounded-xl macos-glass p-2 border border-white/20 shadow-xl cursor-pointer hover:scale-105 transition-transform flex flex-col justify-between group overflow-hidden"
            title={`Switch to ${config?.title || win.title}`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-white/80 truncate">
              <span className="truncate">{config?.title || win.title}</span>
            </div>
            <div className="w-full h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-[10px] text-white/40 italic">
              Stage Preview
            </div>
          </div>
        );
      })}
    </div>
  );
};
