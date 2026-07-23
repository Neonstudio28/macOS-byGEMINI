import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Lock, Unlock, ArrowRight, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/soundEngine';

export const LockScreen = () => {
  const { lockScreenOpen, setLockScreenOpen, wallpaper } = useOS();
  const [password, setPassword] = useState('');

  if (!lockScreenOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    sounds.playBoot();
    setLockScreenOpen(false);
    setPassword('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-12 select-none backdrop-blur-3xl animate-in fade-in duration-300"
      style={wallpaper.type === 'gradient' ? { background: wallpaper.bgStyle } : { backgroundImage: `url(${wallpaper.url})`, backgroundSize: 'cover' }}
    >
      {/* Clock Header */}
      <div className="text-center space-y-2 mt-8">
        <h1 className="text-6xl font-extralight text-white tracking-tighter drop-shadow-lg">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h1>
        <p className="text-sm font-medium text-slate-200 drop-shadow">
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* User Login Card */}
      <form onSubmit={handleUnlock} className="flex flex-col items-center space-y-4 max-w-xs w-full">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 p-1 shadow-2xl relative">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl">
            🌊
          </div>
        </div>
        
        <h2 className="text-base font-bold text-white tracking-wide">Alex — macOS 26 Tahoe</h2>

        <div className="relative w-full">
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password or press Enter..."
            autoFocus
            className="w-full pl-4 pr-10 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-center shadow-xl"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1.5 p-1 rounded-full bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition-colors"
          >
            <ArrowRight size={14} />
          </button>
        </div>

        <p className="text-[11px] text-slate-300/80 font-mono">Touch ID or Enter Password to Unlock</p>
      </form>

      {/* Footer Specs */}
      <div className="text-[11px] text-slate-300 flex items-center gap-2">
        <Sparkles size={13} className="text-cyan-400" />
        <span>macOS 26 Tahoe • Liquid Glass Edition</span>
      </div>
    </div>
  );
};
