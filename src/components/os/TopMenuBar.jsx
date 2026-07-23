import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOS } from '../../context/OSContext';
import {
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Search,
  Sliders,
  Power,
  RotateCcw,
  Lock,
  Info,
  Sparkles,
  AlertTriangle,
  Battery,
  BatteryCharging,
  Monitor,
} from 'lucide-react';
import { APP_CONFIGS } from '../../utils/initialData';

// ─── Menu Definitions ─────────────────────────────────────────────────────────

const MENUS = {
  Finder: {
    File: [
      { label: 'New Finder Window', shortcut: '⌘N' },
      { label: 'New Folder', shortcut: '⇧⌘N' },
      { label: 'New Folder with Selection', shortcut: '⌃⌘N', disabled: true },
      { label: 'New Smart Folder', disabled: true },
      { separator: true },
      { label: 'Open', shortcut: '⌘O' },
      { label: 'Open With', hasSubmenu: true, disabled: true },
      { separator: true },
      { label: 'Close Window', shortcut: '⌘W' },
      { separator: true },
      { label: 'Get Info', shortcut: '⌘I', disabled: true },
      { separator: true },
      { label: 'Move to Trash', shortcut: '⌘⌫', disabled: true },
      { separator: true },
      { label: 'Find…', shortcut: '⌘F' },
    ],
    Edit: [
      { label: 'Undo', shortcut: '⌘Z', disabled: true },
      { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
      { separator: true },
      { label: 'Cut', shortcut: '⌘X', disabled: true },
      { label: 'Copy', shortcut: '⌘C', disabled: true },
      { label: 'Paste', shortcut: '⌘V', disabled: true },
      { label: 'Select All', shortcut: '⌘A' },
      { separator: true },
      { label: 'Show Clipboard', disabled: true },
      { label: 'Start Dictation…', shortcut: 'fn fn', disabled: true },
    ],
    View: [
      { label: 'as Icons', shortcut: '⌘1' },
      { label: 'as List', shortcut: '⌘2' },
      { label: 'as Columns', shortcut: '⌘3' },
      { label: 'as Gallery', shortcut: '⌘4' },
      { separator: true },
      { label: 'Sort By', hasSubmenu: true },
      { label: 'Clean Up', disabled: true },
      { separator: true },
      { label: 'Hide Sidebar', shortcut: '⌥⌘S' },
      { label: 'Show Preview', shortcut: '⇧⌘P' },
      { separator: true },
      { label: 'Enter Full Screen', shortcut: '⌃⌘F' },
    ],
    Go: [
      { label: 'Back', shortcut: '⌘[', disabled: true },
      { label: 'Forward', shortcut: '⌘]', disabled: true },
      { separator: true },
      { label: 'Home', shortcut: '⇧⌘H' },
      { label: 'Desktop', shortcut: '⇧⌘D' },
      { label: 'Downloads', shortcut: '⌥⌘L' },
      { label: 'Applications', shortcut: '⇧⌘A' },
      { label: 'Documents', shortcut: '⇧⌘O' },
      { separator: true },
      { label: 'Connect to Server…', shortcut: '⌘K' },
    ],
    Window: [
      { label: 'Minimize', shortcut: '⌘M' },
      { label: 'Zoom', disabled: true },
      { separator: true },
      { label: 'Bring All to Front', disabled: true },
    ],
    Help: [
      { label: 'Search', shortcut: '⌘?' },
      { separator: true },
      { label: 'macOS Help', shortcut: '⌘?' },
    ],
  },
};

// Fallback generic menus for other apps
const GENERIC_MENUS = {
  File: [
    { label: 'New', shortcut: '⌘N' },
    { label: 'Open…', shortcut: '⌘O' },
    { label: 'Close', shortcut: '⌘W' },
    { separator: true },
    { label: 'Save', shortcut: '⌘S' },
    { label: 'Save As…', shortcut: '⇧⌘S' },
    { separator: true },
    { label: 'Print…', shortcut: '⌘P' },
  ],
  Edit: [
    { label: 'Undo', shortcut: '⌘Z' },
    { label: 'Redo', shortcut: '⇧⌘Z' },
    { separator: true },
    { label: 'Cut', shortcut: '⌘X' },
    { label: 'Copy', shortcut: '⌘C' },
    { label: 'Paste', shortcut: '⌘V' },
    { label: 'Select All', shortcut: '⌘A' },
    { separator: true },
    { label: 'Find…', shortcut: '⌘F' },
  ],
  View: [
    { label: 'Enter Full Screen', shortcut: '⌃⌘F' },
    { separator: true },
    { label: 'Show Toolbar', shortcut: '⌥⌘T' },
    { label: 'Customize Toolbar…' },
  ],
  Go: [
    { label: 'Back', shortcut: '⌘[' },
    { label: 'Forward', shortcut: '⌘]' },
    { separator: true },
    { label: 'Home', shortcut: '⇧⌘H' },
  ],
  Window: [
    { label: 'Minimize', shortcut: '⌘M' },
    { label: 'Zoom' },
    { separator: true },
    { label: 'Bring All to Front' },
  ],
  Help: [
    { label: 'Search', shortcut: '⌘?' },
    { separator: true },
    { label: 'macOS Help' },
  ],
};

const APPLE_MENU = [
  { label: 'About This Mac', icon: <Info size={13} />, action: 'aboutMac' },
  { separator: true },
  { label: 'System Settings…', icon: <Sliders size={13} />, action: 'settings' },
  { label: 'App Store…', icon: <Sparkles size={13} />, action: 'appstore' },
  { separator: true },
  { label: 'Recent Items', hasSubmenu: true, disabled: true },
  { separator: true },
  { label: 'Force Quit…', icon: <AlertTriangle size={13} />, shortcut: '⌥⌘Esc', action: 'forceQuit' },
  { separator: true },
  { label: 'Sleep', icon: <Monitor size={13} />, action: 'sleep' },
  { label: 'Restart…', icon: <RotateCcw size={13} />, action: 'restart' },
  { label: 'Shut Down…', icon: <Power size={13} />, action: 'shutdown', danger: true },
  { separator: true },
  { label: 'Lock Screen', icon: <Lock size={13} />, shortcut: '⌘L', action: 'lock' },
];

// ─── DropdownMenu component ────────────────────────────────────────────────────

const DropdownMenu = ({ items, onClose, openApp, forceQuitFn, restartFn, shutdownFn, lockFn }) => {
  const handleAction = (item) => {
    if (item.disabled) return;
    if (item.action === 'settings') { openApp('settings'); }
    else if (item.action === 'appstore') { openApp('appstore'); }
    else if (item.action === 'aboutMac') { openApp('settings'); }
    else if (item.action === 'forceQuit') { forceQuitFn(); }
    else if (item.action === 'restart') { restartFn(); }
    else if (item.action === 'shutdown') { shutdownFn(); }
    else if (item.action === 'lock') { lockFn(); }
    onClose();
  };

  return (
    <div
      className="absolute left-0 top-full mt-0.5 min-w-[220px] rounded-xl shadow-2xl z-[200] overflow-hidden border border-white/15 animate-in fade-in zoom-in-95 duration-100 origin-top-left"
      style={{
        background: 'rgba(30, 30, 35, 0.88)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      }}
    >
      <div className="p-1">
        {items.map((item, i) => {
          if (item.separator) {
            return <div key={i} className="my-0.5 border-t border-white/10 mx-2" />;
          }
          return (
            <button
              key={i}
              disabled={item.disabled}
              onClick={() => handleAction(item)}
              className={`w-full text-left px-2.5 py-[5px] rounded-md text-[13px] flex items-center justify-between gap-2 transition-colors group
                ${item.disabled
                  ? 'text-white/30 cursor-default'
                  : item.danger
                  ? 'text-white/85 hover:bg-[#FF3B30] hover:text-white cursor-default'
                  : 'text-white/85 hover:bg-[#007AFF] hover:text-white cursor-default'
                }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                {item.icon && <span className="shrink-0 opacity-80">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </span>
              <span className="flex items-center gap-1 shrink-0">
                {item.hasSubmenu && <span className="text-[10px] opacity-50">›</span>}
                {item.shortcut && (
                  <span className="text-[11px] opacity-50 font-mono tracking-tight">{item.shortcut}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── AppMenu component ─────────────────────────────────────────────────────────

const AppMenuDropdown = ({ menuName, items, onClose }) => {
  return (
    <div
      className="absolute left-0 top-full mt-0.5 min-w-[200px] rounded-xl shadow-2xl z-[200] overflow-hidden border border-white/15 animate-in fade-in zoom-in-95 duration-100 origin-top-left"
      style={{
        background: 'rgba(30, 30, 35, 0.88)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      }}
    >
      <div className="p-1">
        {items.map((item, i) => {
          if (item.separator) {
            return <div key={i} className="my-0.5 border-t border-white/10 mx-2" />;
          }
          return (
            <button
              key={i}
              disabled={item.disabled}
              onClick={onClose}
              className={`w-full text-left px-2.5 py-[5px] rounded-md text-[13px] flex items-center justify-between gap-3 transition-colors
                ${item.disabled
                  ? 'text-white/30 cursor-default'
                  : 'text-white/85 hover:bg-[#007AFF] hover:text-white cursor-default'
                }`}
            >
              <span className="truncate">{item.label}</span>
              <span className="flex items-center gap-1 shrink-0">
                {item.hasSubmenu && <span className="text-[10px] opacity-50">›</span>}
                {item.shortcut && (
                  <span className="text-[11px] opacity-50 font-mono tracking-tight">{item.shortcut}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── BatteryIcon ───────────────────────────────────────────────────────────────

const BatteryIcon = () => {
  const [level, setLevel] = useState(82);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((bat) => {
        setLevel(Math.round(bat.level * 100));
        setCharging(bat.charging);
        bat.addEventListener('levelchange', () => setLevel(Math.round(bat.level * 100)));
        bat.addEventListener('chargingchange', () => setCharging(bat.charging));
      }).catch(() => {});
    }
  }, []);

  return (
    <span className="flex items-center gap-0.5 text-[11px]">
      {charging ? <BatteryCharging size={13} /> : <Battery size={13} />}
      <span className="hidden md:inline">{level}%</span>
    </span>
  );
};

// ─── TopMenuBar ────────────────────────────────────────────────────────────────

export const TopMenuBar = () => {
  const {
    windows,
    activeWindowId,
    openApp,
    wifi,
    controlCenterOpen,
    setControlCenterOpen,
    notificationCenterOpen,
    setNotificationCenterOpen,
    setSpotlightOpen,
    setLockScreenOpen,
    setForceQuitOpen,
    restartOS,
    shutdownOS,
  } = useOS();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [openMenu, setOpenMenu] = useState(null); // 'apple' | 'appname' | 'File' | 'Edit' | ...
  const menuBarRef = useRef(null);

  const activeWindow = windows.find((w) => w.id === activeWindowId && !w.isMinimized);
  const activeAppName = activeWindow ? APP_CONFIGS[activeWindow.appKey]?.title || 'Finder' : 'Finder';

  // Determine which menu set to use
  const appMenus = MENUS[activeAppName] || GENERIC_MENUS;
  const appMenuNames = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleMenu = useCallback((name) => {
    setOpenMenu((prev) => (prev === name ? null : name));
  }, []);

  const closeMenu = useCallback(() => setOpenMenu(null), []);

  const menuBtnClass = (name) =>
    `relative px-2.5 py-[2px] rounded text-[13px] transition-colors select-none cursor-default
     ${openMenu === name ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/15 hover:text-white'}`;

  return (
    <header
      ref={menuBarRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-1 select-none"
      style={{
        height: '24px',
        background: 'rgba(0,0,0,0.32)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
      }}
    >
      {/* ── LEFT: Apple + App menus ── */}
      <div className="flex items-center h-full">

        {/* Apple Menu */}
        <div className="relative flex items-center h-full">
          <button
            onClick={() => toggleMenu('apple')}
            className={menuBtnClass('apple') + ' font-semibold text-[15px] leading-none px-3'}
            aria-label="Apple menu"
          >
            
          </button>
          {openMenu === 'apple' && (
            <DropdownMenu
              items={APPLE_MENU}
              onClose={closeMenu}
              openApp={openApp}
              forceQuitFn={() => setForceQuitOpen(true)}
              restartFn={restartOS}
              shutdownFn={shutdownOS}
              lockFn={() => setLockScreenOpen(true)}
            />
          )}
        </div>

        {/* Active App Name (bold) */}
        <div className="relative flex items-center h-full">
          <button
            onClick={() => toggleMenu('appname')}
            className={menuBtnClass('appname') + ' font-bold'}
          >
            {activeAppName}
          </button>
          {openMenu === 'appname' && (
            <AppMenuDropdown
              menuName={activeAppName}
              items={[
                { label: `About ${activeAppName}`, action: 'about' },
                { separator: true },
                { label: 'Settings…', shortcut: '⌘,' },
                { separator: true },
                { label: `Hide ${activeAppName}`, shortcut: '⌘H' },
                { label: 'Hide Others', shortcut: '⌥⌘H' },
                { label: 'Show All' },
                { separator: true },
                { label: `Quit ${activeAppName}`, shortcut: '⌘Q' },
              ]}
              onClose={closeMenu}
            />
          )}
        </div>

        {/* App sub-menus: File, Edit, View, Go, Window, Help */}
        {appMenuNames.map((name) => (
          <div key={name} className="relative flex items-center h-full">
            <button
              onClick={() => toggleMenu(name)}
              className={menuBtnClass(name) + ' font-normal hidden sm:flex'}
            >
              {name}
            </button>
            {openMenu === name && (
              <AppMenuDropdown
                menuName={name}
                items={appMenus[name] || GENERIC_MENUS[name] || []}
                onClose={closeMenu}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── RIGHT: Status Items ── */}
      <div
        className="flex items-center h-full gap-0.5 text-white/90"
        style={{ fontSize: '13px' }}
      >
        {/* Battery */}
        <button
          className="px-2 py-[2px] rounded hover:bg-white/15 transition-colors flex items-center gap-1"
          title="Battery"
        >
          <BatteryIcon />
        </button>

        {/* Wi-Fi */}
        <button
          className="px-2 py-[2px] rounded hover:bg-white/15 transition-colors flex items-center"
          title={wifi ? 'Wi-Fi: Connected' : 'Wi-Fi: Off'}
        >
          {wifi ? <Wifi size={14} /> : <WifiOff size={14} className="text-white/40" />}
        </button>

        {/* Control Center */}
        <button
          onClick={() => {
            setControlCenterOpen(!controlCenterOpen);
            setNotificationCenterOpen(false);
          }}
          className={`px-2 py-[2px] rounded hover:bg-white/15 transition-colors flex items-center ${controlCenterOpen ? 'bg-white/20' : ''}`}
          title="Control Center"
        >
          <Sliders size={13} />
        </button>

        {/* Spotlight */}
        <button
          onClick={() => setSpotlightOpen(true)}
          className="px-2 py-[2px] rounded hover:bg-white/15 transition-colors flex items-center"
          title="Spotlight Search (⌘Space)"
        >
          <Search size={13} />
        </button>

        {/* Date & Time */}
        <button
          onClick={() => {
            setNotificationCenterOpen(!notificationCenterOpen);
            setControlCenterOpen(false);
          }}
          className={`px-2 py-[2px] rounded hover:bg-white/15 transition-colors flex items-center gap-1 text-[12px] font-medium ${notificationCenterOpen ? 'bg-white/20' : ''}`}
          title="Notification Center"
        >
          <span className="hidden md:inline text-white/80">{dateStr}</span>
          <span>{timeStr}</span>
        </button>
      </div>
    </header>
  );
};
