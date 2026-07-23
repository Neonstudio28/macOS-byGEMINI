import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { ArrowRight, Lock, Power, Moon, RotateCcw, LogIn } from 'lucide-react';
import { sounds } from '../../utils/soundEngine';

const USER = {
  name: 'Alex',
  fullName: 'Alex Johnson',
  avatar: 'A',
  gradient: 'from-cyan-500 to-indigo-600'
};

export const BootScreen = () => {
  const { isBooting, setIsBooting, isLocked, setIsLocked, wallpaper } = useOS();

  // Boot state
  const [bootPhase, setBootPhase] = useState('logo');  // 'logo' | 'progress' | 'fading'
  const [bootProgress, setBootProgress] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Clock for Lock/Login Screen
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // macOS Boot Sequence
  useEffect(() => {
    if (!isBooting) return;

    setBootPhase('logo');
    setBootProgress(0);

    const chimeTimer = setTimeout(() => {
      try { sounds.playBoot(); } catch (e) {}
    }, 400);

    const progressStart = setTimeout(() => {
      setBootPhase('progress');
      const startTime = Date.now();
      const duration = 2400;

      const interval = setInterval(() => {
        const pct = Math.min(100, Math.floor(((Date.now() - startTime) / duration) * 100));
        setBootProgress(pct);

        if (pct >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setBootPhase('fading');
            setTimeout(() => setIsBooting(false), 500);
          }, 200);
        }
      }, 28);

      return () => clearInterval(interval);
    }, 600);

    const safety = setTimeout(() => {
      setBootPhase('fading');
      setTimeout(() => setIsBooting(false), 400);
    }, 4000);

    return () => {
      clearTimeout(chimeTimer);
      clearTimeout(progressStart);
      clearTimeout(safety);
    };
  }, [isBooting, setIsBooting]);

  // Login click handler — simple click to log in!
  const handleLoginClick = () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try { sounds.playLogin(); } catch(err) {}

    setTimeout(() => {
      setIsLocked(false);
      setIsLoggingIn(false);
    }, 600);
  };

  // 1. Booting Screen (Black screen with Apple Logo )
  if (isBooting) {
    const isFading = bootPhase === 'fading';
    return (
      <div
        className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none transition-opacity duration-500 ${
          isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={() => {
          setBootPhase('fading');
          setTimeout(() => setIsBooting(false), 300);
        }}
      >
        {/* Apple Logo  */}
        <div
          className="text-white select-none filter drop-shadow-2xl"
          style={{
            fontSize: '84px',
            lineHeight: 1,
            fontWeight: 100,
            marginBottom: bootPhase === 'progress' ? '50px' : '0px',
            transition: 'margin-bottom 0.4s ease'
          }}
        >
          
        </div>

        {/* Progress Bar Track */}
        <div
          className="absolute bottom-[16%]"
          style={{
            opacity: bootPhase === 'progress' || bootPhase === 'fading' ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <div
            className="rounded-full overflow-hidden"
            style={{ width: '200px', height: '3.5px', background: 'rgba(255,255,255,0.18)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-75 ease-linear"
              style={{
                width: `${bootProgress}%`,
                background: '#ffffff'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. macOS Login / Lock Screen (Click to Log In)
  if (isLocked) {
    return (
      <div
        className="fixed inset-0 z-[9000] flex flex-col justify-between items-center p-12 select-none font-sans text-white overflow-hidden transition-all duration-500"
        style={
          wallpaper.type === 'gradient'
            ? { background: wallpaper.bgStyle }
            : { backgroundImage: `url(${wallpaper.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        }
      >
        {/* Frosted Glass Overlay */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-3xl z-0" />

        {/* Clock Header */}
        <div className="relative z-10 text-center space-y-1 mt-8">
          <div className="text-7xl font-extralight tracking-tight text-white drop-shadow-2xl">
            {currentTime}
          </div>
          <div className="text-sm font-medium text-white/80 drop-shadow">
            {currentDate}
          </div>
        </div>

        {/* User Card with Log In Button */}
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="relative group cursor-pointer" onClick={handleLoginClick}>
            <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${USER.gradient} border-2 border-white/30 shadow-2xl flex items-center justify-center text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 ${isLoggingIn ? 'scale-110 ring-4 ring-cyan-400' : ''}`}>
              {USER.avatar}
            </div>
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white drop-shadow-lg">{USER.fullName}</h2>
            <p className="text-xs text-cyan-300 font-mono">macOS 26 Tahoe Administrator</p>
          </div>

          {/* Simple Log In Button */}
          <button
            onClick={handleLoginClick}
            disabled={isLoggingIn}
            className="px-8 py-3 rounded-full bg-[#007AFF] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-2xl transition-all border border-white/20"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2 font-mono">
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Logging In...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn size={15} /> Log In
              </span>
            )}
          </button>

          <span className="text-[11px] text-white/60 font-medium">Click Log In or User Avatar to Enter</span>
        </div>

        {/* Power Options Footer */}
        <div className="relative z-10 flex items-center space-x-10 text-xs text-white/70">
          <button onClick={handleLoginClick} className="flex flex-col items-center gap-1.5 hover:text-white transition-colors group">
            <div className="p-3 rounded-full bg-white/10 border border-white/15 group-hover:bg-white/20 shadow-lg"><Moon size={16} /></div>
            <span>Sleep</span>
          </button>
          <button onClick={() => window.location.reload()} className="flex flex-col items-center gap-1.5 hover:text-white transition-colors group">
            <div className="p-3 rounded-full bg-white/10 border border-white/15 group-hover:bg-white/20 shadow-lg"><RotateCcw size={16} /></div>
            <span>Restart</span>
          </button>
          <button onClick={() => window.location.reload()} className="flex flex-col items-center gap-1.5 hover:text-white transition-colors group">
            <div className="p-3 rounded-full bg-white/10 border border-white/15 group-hover:bg-white/20 shadow-lg"><Power size={16} /></div>
            <span>Shut Down</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
