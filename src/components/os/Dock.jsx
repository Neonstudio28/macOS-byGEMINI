import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  Folder, 
  Compass, 
  Terminal, 
  FileText, 
  Music, 
  Image as ImageIcon, 
  Sliders, 
  Calculator, 
  Code, 
  Gamepad2,
  Trash2,
  MessageSquare,
  Mail,
  Store,
  HardDrive,
  Activity,
  Video,
  Users
} from 'lucide-react';
import { APP_CONFIGS } from '../../utils/initialData';

const DOCK_APPS = [
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

export const Dock = () => {
  const { windows, openApp, minimizeWindow, activeWindowId, focusWindow, emptyTrash, filesystem } = useOS();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [bouncingApp, setBouncingApp] = useState(null);

  const trashFolder = filesystem.children?.find(c => c.id === 'trash');
  const hasTrashItems = trashFolder?.children && trashFolder.children.length > 0;

  const handleAppClick = (appKey) => {
    setBouncingApp(appKey);
    setTimeout(() => setBouncingApp(null), 800);

    const targetWindow = windows.find(w => w.appKey === appKey);
    if (targetWindow) {
      if (targetWindow.isMinimized) {
        openApp(appKey);
      } else if (activeWindowId === targetWindow.id) {
        minimizeWindow(targetWindow.id);
      } else {
        focusWindow(targetWindow.id);
      }
    } else {
      openApp(appKey);
    }
  };

  const getScale = (index) => {
    if (hoveredIdx === null) return 1;
    const dist = Math.abs(hoveredIdx - index);
    if (dist === 0) return 1.48;
    if (dist === 1) return 1.25;
    if (dist === 2) return 1.1;
    return 1;
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 select-none max-w-[96vw] overflow-x-auto">
      <div 
        className="macos-dock flex items-end gap-1.5 px-3 py-2 transition-all duration-300"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {DOCK_APPS.map((app, index) => {
          const Icon = app.icon;
          const config = APP_CONFIGS[app.key];
          const isOpen = windows.some(w => w.appKey === app.key);
          const isForeground = windows.some(w => w.appKey === app.key && w.id === activeWindowId && !w.isMinimized);
          const scale = getScale(index);
          const isBouncing = bouncingApp === app.key;

          return (
            <div 
              key={app.key} 
              className="relative group flex flex-col items-center"
              onMouseEnter={() => setHoveredIdx(index)}
            >
              {/* Tooltip */}
              <div className="absolute -top-10 px-2.5 py-1 rounded-md bg-slate-950/90 text-white text-[11px] font-medium backdrop-blur-md border border-white/15 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                {config?.title || app.title}
              </div>

              {/* Dock Icon Button */}
              <button
                onClick={() => handleAppClick(app.key)}
                style={{ transform: `scale(${scale})` }}
                className={`macos-app-icon w-11 h-11 bg-gradient-to-tr ${app.color} p-0 flex items-center justify-center text-white shadow-lg ${
                  isBouncing ? 'animate-bounce' : ''
                }`}
              >
                {app.img ? (
                  <img src={app.img} alt={app.title} className="w-full h-full object-cover rounded-[22.37%]" />
                ) : (
                  <Icon size={22} className="filter drop-shadow-md z-10" />
                )}
              </button>

              {/* Active Dot */}
              <div className="h-1.5 flex items-center justify-center mt-1">
                {isOpen && (
                  <span className={`w-1.5 h-1.5 rounded-full transition-all ${isForeground ? 'bg-[#007AFF] w-3 ring-2 ring-[#007AFF]/50' : 'bg-slate-300/80'}`} />
                )}
              </div>
            </div>
          );
        })}

        {/* Divider */}
        <div className="h-9 w-px bg-white/20 my-auto mx-1" />

        {/* Trash Icon */}
        <div className="relative group flex flex-col items-center">
          <div className="absolute -top-10 px-2.5 py-1 rounded-md bg-slate-950/90 text-white text-[11px] font-medium backdrop-blur-md border border-white/15 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
            {hasTrashItems ? 'Trash (Items)' : 'Trash (Empty)'}
          </div>
          <button
            onClick={() => openApp('finder', { currentFolderId: 'trash' })}
            onContextMenu={(e) => { e.preventDefault(); emptyTrash(); }}
            className="macos-app-icon w-11 h-11 bg-slate-800 p-2 flex items-center justify-center text-slate-300 hover:text-white shadow-lg border border-white/20 transition-transform hover:scale-120"
          >
            <Trash2 size={20} className={hasTrashItems ? 'text-amber-400 z-10' : 'text-slate-400 z-10'} />
          </button>
          <div className="h-1.5" />
        </div>
      </div>
    </div>
  );
};
