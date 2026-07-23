import React from 'react';
import { useOS } from '../../context/OSContext';
import { Power, RotateCcw } from 'lucide-react';

export const ShutdownScreen = () => {
  const { isShutdown, setIsShutdown, restartOS } = useOS();

  if (!isShutdown) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center space-y-6 text-slate-100 select-none animate-in fade-in duration-500">
      <div className="text-6xl animate-pulse filter drop-shadow-2xl">🌊</div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">macOS 26 Tahoe</h2>
        <p className="text-xs text-slate-500 font-mono">It is now safe to turn off your web browser.</p>
      </div>

      <button 
        onClick={() => { setIsShutdown(false); restartOS(); }}
        className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-2xl transition-transform active:scale-95"
      >
        <RotateCcw size={15} /> Restart macOS
      </button>
    </div>
  );
};
