import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Search, X, Folder, Compass, Terminal, FileText, Music, Image as ImageIcon, Sliders, Calculator, Code, Gamepad2, MessageSquare, Mail, Store, HardDrive, Activity, Video, Users } from 'lucide-react';
import { sounds } from '../../utils/soundEngine';

const LAUNCHPAD_APPS = [
  { key: 'finder', title: 'Finder', icon: Folder, img: '/icons/finder.jpg', color: 'from-blue-500 to-cyan-400' },
  { key: 'safari', title: 'Safari', icon: Compass, img: '/icons/safari.jpg', color: 'from-sky-400 to-indigo-500' },
  { key: 'facetime', title: 'FaceTime', icon: Video, img: '/icons/facetime.jpg', color: 'from-emerald-400 to-teal-600' },
  { key: 'messages', title: 'Messages', icon: MessageSquare, img: '/icons/messages.jpg', color: 'from-emerald-400 to-green-600' },
  { key: 'mail', title: 'Mail', icon: Mail, img: '/icons/mail.jpg', color: 'from-blue-500 to-indigo-600' },
  { key: 'contacts', title: 'Contacts', icon: Users, color: 'from-[#007AFF] to-indigo-600' },
  { key: 'appstore', title: 'App Store', icon: Store, img: '/icons/appstore.jpg', color: 'from-sky-400 to-blue-600' },
  { key: 'terminal', title: 'Terminal', icon: Terminal, img: '/icons/terminal.jpg', color: 'from-slate-700 to-slate-900' },
  { key: 'notes', title: 'Notes', icon: FileText, color: 'from-amber-400 to-amber-600' },
  { key: 'music', title: 'Music', icon: Music, img: '/icons/music.jpg', color: 'from-rose-500 to-pink-600' },
  { key: 'photos', title: 'Photos', icon: ImageIcon, color: 'from-purple-500 to-indigo-600' },
  { key: 'diskutility', title: 'Disk Utility', icon: HardDrive, color: 'from-slate-600 to-slate-800' },
  { key: 'activitymonitor', title: 'Activity Monitor', icon: Activity, color: 'from-emerald-500 to-teal-700' },
  { key: 'code', title: 'Xcode', icon: Code, color: 'from-cyan-500 to-blue-600' },
  { key: 'calculator', title: 'Calculator', icon: Calculator, color: 'from-emerald-400 to-teal-600' },
  { key: 'arcade', title: 'Arcade Pong', icon: Gamepad2, color: 'from-fuchsia-500 to-purple-600' },
  { key: 'chess', title: 'Chess', icon: Gamepad2, img: '/icons/chess.jpg', color: 'from-amber-800 to-stone-900' },
  { key: 'settings', title: 'System Settings', icon: Sliders, img: '/icons/settings.jpg', color: 'from-slate-400 to-slate-600' }
];

export const Launchpad = ({ isOpen, onClose }) => {
  const { openApp } = useOS();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleLaunch = (appKey) => {
    sounds.playClick();
    openApp(appKey);
    onClose();
  };

  const filtered = LAUNCHPAD_APPS.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9300] bg-black/60 backdrop-blur-3xl p-12 flex flex-col justify-between items-center select-none font-sans text-white animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Search Input */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-72 relative mt-4"
      >
        <Search size={14} className="absolute left-3.5 top-2.5 text-white/40" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Launchpad..."
          autoFocus
          className="w-full pl-9 pr-4 py-2 rounded-full bg-white/15 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#007AFF] shadow-xl"
        />
      </div>

      {/* 5x4 Grid App Icons */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="grid grid-cols-5 md:grid-cols-6 gap-8 max-w-4xl w-full my-auto justify-items-center"
      >
        {filtered.map(app => {
          const Icon = app.icon;
          return (
            <button
              key={app.key}
              onClick={() => handleLaunch(app.key)}
              className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-115"
            >
              <div className={`w-16 h-16 rounded-[22.37%] overflow-hidden shadow-2xl border border-white/20 mb-2 flex items-center justify-center bg-gradient-to-tr ${app.color}`}>
                {app.img ? (
                  <img src={app.img} alt={app.title} className="w-full h-full object-cover" />
                ) : (
                  <Icon size={32} className="text-white drop-shadow" />
                )}
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-md tracking-tight group-hover:text-cyan-300">
                {app.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-white" />
        <span className="w-2 h-2 rounded-full bg-white/30" />
      </div>
    </div>
  );
};
