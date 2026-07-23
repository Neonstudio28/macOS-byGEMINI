import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  Wifi, 
  Bluetooth, 
  Share2, 
  Moon, 
  Sun, 
  Tv, 
  Volume2, 
  VolumeX, 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  Check, 
  X,
  Sparkles,
  Palette
} from 'lucide-react';
import { sounds } from '../../utils/soundEngine';

export const ControlCenter = () => {
  const { 
    controlCenterOpen, setControlCenterOpen,
    wifi, setWifi,
    bluetooth, setBluetooth,
    brightness, setBrightness,
    volume, setVolume,
    soundEnabled, setSoundEnabled,
    themeMode, setThemeMode, resolvedTheme
  } = useOS();

  const [airdropMode, setAirdropMode] = useState('Contacts Only');
  const [focusMode, setFocusMode] = useState('Off');
  const [isPlaying, setIsPlaying] = useState(false);
  const [airplayDevice, setAirplayDevice] = useState(null);

  if (!controlCenterOpen) return null;

  const togglePlay = () => {
    sounds.playClick();
    setIsPlaying(!isPlaying);
  };

  const toggleTheme = () => {
    sounds.playClick();
    setThemeMode(prev => prev === 'dark' ? 'light' : prev === 'light' ? 'auto' : 'dark');
  };

  return (
    <div className="fixed top-7 right-3 z-[9100] w-88 macos-glass rounded-2xl p-3.5 border border-white/20 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150 select-none text-xs font-sans">
      
      {/* 2x2 Network & Theme Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Wi-Fi & Bluetooth Stack */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <button 
            onClick={() => { sounds.playClick(); setWifi(!wifi); }}
            className="w-full flex items-center gap-2 text-left"
          >
            <div className={`p-1.5 rounded-full ${wifi ? 'bg-[#007AFF] text-white' : 'bg-white/15 text-white/40'}`}>
              <Wifi size={14} />
            </div>
            <div>
              <div className="font-bold text-xs">Wi-Fi</div>
              <div className="text-[10px] text-white/50">{wifi ? 'Tahoe-5G' : 'Off'}</div>
            </div>
          </button>

          <button 
            onClick={() => { sounds.playClick(); setBluetooth(!bluetooth); }}
            className="w-full flex items-center gap-2 text-left pt-1 border-t border-white/10"
          >
            <div className={`p-1.5 rounded-full ${bluetooth ? 'bg-[#007AFF] text-white' : 'bg-white/15 text-white/40'}`}>
              <Bluetooth size={14} />
            </div>
            <div>
              <div className="font-bold text-xs">Bluetooth</div>
              <div className="text-[10px] text-white/50">{bluetooth ? 'On' : 'Off'}</div>
            </div>
          </button>
        </div>

        {/* Appearance Mode & Focus Stack */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-2 text-left"
          >
            <div className={`p-1.5 rounded-full ${resolvedTheme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-slate-900'}`}>
              {resolvedTheme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            </div>
            <div className="truncate">
              <div className="font-bold text-xs">Appearance</div>
              <div className="text-[10px] text-white/50 capitalize">{themeMode} ({resolvedTheme})</div>
            </div>
          </button>

          <button 
            onClick={() => {
              sounds.playClick();
              setFocusMode(prev => prev === 'Off' ? 'Do Not Disturb' : prev === 'Do Not Disturb' ? 'Work' : 'Off');
            }}
            className="w-full flex items-center gap-2 text-left pt-1 border-t border-white/10"
          >
            <div className={`p-1.5 rounded-full ${focusMode !== 'Off' ? 'bg-purple-600 text-white' : 'bg-white/15 text-white/40'}`}>
              <Moon size={14} />
            </div>
            <div className="truncate">
              <div className="font-bold text-xs">Focus</div>
              <div className="text-[10px] text-white/50 truncate">{focusMode}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Screen Mirroring Pill */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <button 
          onClick={() => {
            sounds.playClick();
            setAirplayDevice(prev => prev ? null : 'Living Room Apple TV 4K');
          }}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-white/15 text-white">
              <Tv size={14} />
            </div>
            <div className="text-left">
              <div className="font-bold text-xs">Screen Mirroring</div>
              <div className="text-[10px] text-white/50">{airplayDevice || 'Not Mirroring'}</div>
            </div>
          </div>
          {airplayDevice && <Check size={14} className="text-emerald-400" />}
        </button>
      </div>

      {/* Display Brightness Slider */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-medium text-white/70">
          <span className="flex items-center gap-1.5"><Sun size={13} className="text-amber-400" /> Display Brightness</span>
          <span className="font-mono text-white">{brightness}%</span>
        </div>
        <input 
          type="range" 
          min="20" 
          max="100" 
          value={brightness}
          onChange={(e) => setBrightness(parseInt(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer"
        />
      </div>

      {/* Sound Volume Slider */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-medium text-white/70">
          <span className="flex items-center gap-1.5"><Volume2 size={13} className="text-[#007AFF]" /> Sound Volume</span>
          <span className="font-mono text-white">{volume}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-full accent-[#007AFF] cursor-pointer"
        />
      </div>

      {/* Now Playing Media Controller */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow">
            <Music size={18} />
          </div>
          <div>
            <div className="font-bold text-xs text-white">Tahoe Liquid Synthwave</div>
            <div className="text-[10px] text-rose-300 font-medium">Apple Music Stream</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={togglePlay} className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white">
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={() => sounds.playClick()} className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white">
            <SkipForward size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
