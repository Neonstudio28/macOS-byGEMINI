import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import { 
  Sliders, 
  Monitor, 
  Info, 
  Check, 
  Wifi, 
  Bluetooth, 
  Volume2, 
  Battery, 
  Sparkles, 
  Sun, 
  Moon, 
  Layers,
  Layout,
  HardDrive,
  User,
  ShieldCheck,
  Bell,
  Lock,
  Globe,
  Mic,
  Palette,
  Eye,
  Smartphone,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { DEFAULT_WALLPAPERS } from '../utils/initialData';
import { sounds } from '../utils/soundEngine';

const ACCENT_COLORS = [
  { id: 'blue', hex: '#007AFF', label: 'Blue' },
  { id: 'purple', hex: '#AF52DE', label: 'Purple' },
  { id: 'pink', hex: '#FF2D55', label: 'Pink' },
  { id: 'red', hex: '#FF3B30', label: 'Red' },
  { id: 'orange', hex: '#FF9500', label: 'Orange' },
  { id: 'yellow', hex: '#FFCC00', label: 'Yellow' },
  { id: 'green', hex: '#34C759', label: 'Green' },
  { id: 'graphite', hex: '#8E8E93', label: 'Graphite' }
];

export const ValSettings = () => {
  const { 
    wallpaper, setWallpaper, 
    glassBlur, setGlassBlur, 
    glassOpacity, setGlassOpacity, 
    volume, setVolume,
    soundEnabled, setSoundEnabled,
    wifi, setWifi,
    bluetooth, setBluetooth,
    brightness, setBrightness,
    stageManagerEnabled, setStageManagerEnabled,
    themeMode, setThemeMode
  } = useOS();

  const [activePane, setActivePane] = useState('general');
  const [selectedAccent, setSelectedAccent] = useState('blue');
  const [appearanceMode, setAppearanceMode] = useState('dark');
  const [dockHide, setDockHide] = useState(false);
  const [dockSize, setDockSize] = useState(48);
  const [nightShift, setNightShift] = useState(true);
  const [refreshRate, setRefreshRate] = useState('120Hz ProMotion');

  const navItem = (id, label, Icon, category = null) => {
    const isActive = activePane === id;
    return (
      <button
        key={id}
        onClick={() => { sounds.playClick(); setActivePane(id); }}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors font-medium text-xs ${
          isActive ? 'bg-[#007AFF] text-white shadow-sm' : 'hover:bg-white/10 text-white/80'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon size={15} />
          <span>{label}</span>
        </div>
        <ChevronRight size={12} className={isActive ? 'text-white' : 'text-white/20'} />
      </button>
    );
  };

  return (
    <div className="flex h-full w-full bg-[#1E1E1E] text-white/90 font-sans select-none text-xs">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-white/10 p-3 bg-[#252528]/90 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          {/* User Account Card */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-white shadow">
              A
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xs text-white truncate">Alex Johnson</h3>
              <p className="text-[10px] text-white/40 truncate">Apple ID, iCloud & Services</p>
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="space-y-3">
            <div className="space-y-0.5">
              <div className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">System</div>
              {navItem('general', 'General', Info)}
              {navItem('appearance', 'Appearance', Palette)}
              {navItem('siri', 'Siri & Apple Intelligence', Sparkles)}
              {navItem('accessibility', 'Accessibility', Eye)}
            </div>

            <div className="space-y-0.5">
              <div className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Hardware & Optics</div>
              {navItem('displays', 'Displays', Monitor)}
              {navItem('wallpaper', 'Wallpaper', Layers)}
              {navItem('dock', 'Desktop & Dock', Layout)}
              {navItem('sound', 'Sound', Volume2)}
              {navItem('battery', 'Battery', Battery)}
            </div>

            <div className="space-y-0.5">
              <div className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Network & Security</div>
              {navItem('wifi', 'Wi-Fi', Wifi)}
              {navItem('bluetooth', 'Bluetooth', Bluetooth)}
              {navItem('privacy', 'Privacy & Security', ShieldCheck)}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 text-[10px] text-white/40 font-mono">
          macOS 26 Tahoe • Build 26A302
        </div>
      </div>

      {/* Main Details View */}
      <div className="flex-1 p-6 overflow-auto bg-[#1C1C1E]">
        
        {/* General Pane */}
        {activePane === 'general' && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2">About macOS 26 Tahoe</h2>
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3 shadow-xl">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-2xl">
                
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">macOS 26 Tahoe</h3>
                <p className="text-xs text-[#007AFF] font-mono mt-0.5">Version 26.0 (Build 26A302)</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Model Name</span>
                <span className="font-semibold text-white">MacBook Pro 16-inch (2026)</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Chip</span>
                <span className="font-semibold text-white">Apple M4 Max (16-core CPU, 40-core GPU)</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Memory</span>
                <span className="font-semibold text-white">32 GB Unified LPDDR5X</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Storage</span>
                <span className="font-semibold text-white">1 TB APFS Solid State Drive</span>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Pane */}
        {activePane === 'appearance' && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2">Appearance Settings</h2>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="font-bold text-xs text-white">Appearance Mode</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'auto', label: 'Auto', icon: Sparkles }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => { sounds.playClick(); setThemeMode(m.id); }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      themeMode === m.id ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <m.icon size={20} />
                    <span className="font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="font-bold text-xs text-white">Accent Color</div>
              <div className="flex items-center gap-3">
                {ACCENT_COLORS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedAccent(c.id)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                      selectedAccent === c.id ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-105'
                    }`}
                    title={c.label}
                  >
                    {selectedAccent === c.id && <Check size={14} className="text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wallpaper Pane */}
        {activePane === 'wallpaper' && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2">macOS Nature Wallpapers</h2>

            <div className="grid grid-cols-2 gap-4">
              {DEFAULT_WALLPAPERS.map(wp => (
                <div
                  key={wp.id}
                  onClick={() => { sounds.playClick(); setWallpaper(wp); }}
                  className={`group relative h-28 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shadow-lg ${
                    wallpaper.id === wp.id ? 'border-[#007AFF] ring-4 ring-[#007AFF]/30 scale-102' : 'border-white/15 hover:border-white/40'
                  }`}
                >
                  {wp.type === 'gradient' ? (
                    <div className="w-full h-full" style={{ background: wp.bgStyle }} />
                  ) : (
                    <img src={wp.url} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-md text-[11px] font-bold text-white truncate">
                    {wp.name}
                  </div>
                  {wallpaper.id === wp.id && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-[#007AFF] text-white shadow">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Displays Pane */}
        {activePane === 'displays' && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2">Display Settings</h2>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">Brightness</span>
                <span className="font-mono text-[#007AFF]">{brightness}%</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="100" 
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full accent-[#007AFF] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">Refresh Rate</div>
                <div className="text-[10px] text-white/50">ProMotion 120Hz Liquid Retina XDR</div>
              </div>
              <select 
                value={refreshRate}
                onChange={(e) => setRefreshRate(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white focus:outline-none"
              >
                <option value="120Hz ProMotion">120Hz ProMotion</option>
                <option value="60Hz">60Hz Standard</option>
              </select>
            </div>
          </div>
        )}

        {/* Desktop & Dock Pane */}
        {activePane === 'dock' && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2">Desktop & Dock</h2>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">Stage Manager</div>
                <div className="text-[10px] text-white/50">Organize open windows along left stage rail</div>
              </div>
              <input 
                type="checkbox"
                checked={stageManagerEnabled}
                onChange={(e) => setStageManagerEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#007AFF] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Default fallback */}
        {['wifi', 'bluetooth', 'sound', 'battery', 'siri', 'accessibility', 'privacy'].includes(activePane) && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2 capitalize">{activePane} Settings</h2>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
              <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
              <div className="font-bold text-white text-sm">System Connected & Verified</div>
              <p className="text-xs text-white/50">All hardware devices are operating normally under macOS 26 Tahoe.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
