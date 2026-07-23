import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FILESYSTEM, DEFAULT_WALLPAPERS, APP_CONFIGS } from '../utils/initialData';

const OSContext = createContext(null);

export const OSProvider = ({ children }) => {
  // OS System States
  const [isBooting, setIsBooting] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [forceQuitOpen, setForceQuitOpen] = useState(false);
  const [launchpadOpen, setLaunchpadOpen] = useState(false);
  const [stageManagerEnabled, setStageManagerEnabled] = useState(true);

  // Theme Mode ('dark' | 'light' | 'auto')
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('macos_tahoe_theme_mode');
    return saved || 'dark';
  });

  const [resolvedTheme, setResolvedTheme] = useState('dark');

  // Compute resolvedTheme and apply document attribute
  useEffect(() => {
    localStorage.setItem('macos_tahoe_theme_mode', themeMode);
    
    let activeTheme = themeMode;
    if (themeMode === 'auto') {
      const hour = new Date().getHours();
      activeTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    }
    
    setResolvedTheme(activeTheme);
    document.documentElement.setAttribute('data-theme', activeTheme);
    if (activeTheme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
    } else {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
    }
  }, [themeMode]);

  // Wallpaper & Theme
  const [wallpaper, setWallpaper] = useState(DEFAULT_WALLPAPERS[0]);
  const [brightness, setBrightness] = useState(100);
  const [glassBlur, setGlassBlur] = useState(24);
  const [glassOpacity, setGlassOpacity] = useState(0.75);

  // Sound Engine
  const [volume, setVolume] = useState(80);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Connectivity
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);

  // Popover UI State
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [siriOpen, setSiriOpen] = useState(false);
  const [missionControlOpen, setMissionControlOpen] = useState(false);
  const [widgetPanelOpen, setWidgetPanelOpen] = useState(false);

  // Notifications Store
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'macOS Tahoe', body: 'Welcome to macOS 26 Tahoe Liquid Glass Edition!', time: 'Now', unread: true },
    { id: '2', title: 'Messages', body: 'Maya Chen: Review moved to 4 PM 🚀', time: '5m ago', unread: true }
  ]);

  // Window Manager State
  const [windows, setWindows] = useState([
    { id: 'win-finder', appKey: 'finder', title: 'Finder', x: 140, y: 70, width: 850, height: 550, zIndex: 10, isMinimized: false, isMaximized: false }
  ]);
  const [activeWindowId, setActiveWindowId] = useState('win-finder');
  const [nextZIndex, setNextZIndex] = useState(11);

  // Virtual Filesystem State
  const [filesystem, setFilesystem] = useState(() => {
    const saved = localStorage.getItem('macos_tahoe_fs');
    return saved ? JSON.parse(saved) : INITIAL_FILESYSTEM;
  });

  useEffect(() => {
    localStorage.setItem('macos_tahoe_fs', JSON.stringify(filesystem));
  }, [filesystem]);

  // Global macOS Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+Space or Ctrl+Space: Spotlight Search
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setSpotlightOpen(prev => !prev);
      }
      // Cmd+Option+Esc: Force Quit Applications
      else if ((e.metaKey || e.ctrlKey) && e.altKey && e.code === 'Escape') {
        e.preventDefault();
        setForceQuitOpen(prev => !prev);
      }
      // Cmd+L: Lock Screen
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setIsLocked(true);
      }
      // F3: Mission Control
      else if (e.code === 'F3') {
        e.preventDefault();
        setMissionControlOpen(prev => !prev);
      }
      // F4: Glass Widgets Panel
      else if (e.code === 'F4') {
        e.preventDefault();
        setWidgetPanelOpen(prev => !prev);
      }
      // F6: Launchpad
      else if (e.code === 'F6') {
        e.preventDefault();
        setLaunchpadOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Notifications API
  const addNotification = (title, body) => {
    setNotifications(prev => [
      { id: Date.now().toString(), title, body, time: 'Just now', unread: true },
      ...prev
    ]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Window Actions
  const focusWindow = (id) => {
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w));
    setNextZIndex(z => z + 1);
  };

  const openApp = (appKey, initialData = null) => {
    const existing = windows.find(w => w.appKey === appKey);
    if (existing) {
      focusWindow(existing.id);
      if (initialData) {
        setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, data: initialData } : w));
      }
    } else {
      const config = APP_CONFIGS[appKey] || { title: appKey, width: 800, height: 500 };
      const newWinId = `win-${appKey}-${Date.now()}`;
      const offset = (windows.length % 5) * 30;

      const newWindow = {
        id: newWinId,
        appKey,
        title: config.title,
        x: Math.max(40, Math.min(window.innerWidth - config.width - 40, 100 + offset)),
        y: Math.max(40, Math.min(window.innerHeight - config.height - 60, 60 + offset)),
        width: config.width,
        height: config.height,
        zIndex: nextZIndex,
        isMinimized: false,
        isMaximized: false,
        data: initialData
      };

      setWindows(prev => [...prev, newWindow]);
      setActiveWindowId(newWinId);
      setNextZIndex(z => z + 1);
    }
  };

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    const remaining = windows.filter(w => w.id !== id);
    if (remaining.length > 0) {
      setActiveWindowId(remaining[remaining.length - 1].id);
    } else {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const maximizeWindow = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const updateWindowPosition = (id, x, y) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  };

  const updateWindowSize = (id, width, height) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  };

  // Filesystem Helpers
  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const createFSItem = (parentFolderId, name, type, fileType = 'text', content = '') => {
    const newItem = {
      id: `fs-${Date.now()}`,
      name,
      type,
      fileType: type === 'file' ? fileType : undefined,
      content,
      children: type === 'folder' ? [] : undefined
    };

    const updateRecursive = (node) => {
      if (node.id === parentFolderId) {
        return { ...node, children: [...(node.children || []), newItem] };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateRecursive) };
      }
      return node;
    };

    setFilesystem(prev => updateRecursive(prev));
  };

  const deleteFSItem = (itemId) => {
    const updateRecursive = (node) => {
      if (node.children) {
        return {
          ...node,
          children: node.children.filter(c => c.id !== itemId).map(updateRecursive)
        };
      }
      return node;
    };
    setFilesystem(prev => updateRecursive(prev));
  };

  const emptyTrash = () => {
    setFilesystem(prev => {
      const resetTrashNode = (node) => {
        if (node.id === 'trash') return { ...node, children: [] };
        if (node.children) return { ...node, children: node.children.map(resetTrashNode) };
        return node;
      };
      return resetTrashNode(prev);
    });
  };

  // Power actions
  const restartOS = () => {
    setIsBooting(true);
    setWindows([]);
  };

  const shutdownOS = () => {
    setIsShutdown(true);
  };

  return (
    <OSContext.Provider value={{
      isBooting, setIsBooting,
      isLocked, setIsLocked,
      isShutdown, setIsShutdown,
      forceQuitOpen, setForceQuitOpen,
      launchpadOpen, setLaunchpadOpen,
      stageManagerEnabled, setStageManagerEnabled,
      themeMode, setThemeMode,
      resolvedTheme,
      wallpaper, setWallpaper,
      brightness, setBrightness,
      glassBlur, setGlassBlur,
      glassOpacity, setGlassOpacity,
      volume, setVolume,
      soundEnabled, setSoundEnabled,
      wifi, setWifi,
      bluetooth, setBluetooth,
      spotlightOpen, setSpotlightOpen,
      controlCenterOpen, setControlCenterOpen,
      notificationCenterOpen, setNotificationCenterOpen,
      siriOpen, setSiriOpen,
      missionControlOpen, setMissionControlOpen,
      widgetPanelOpen, setWidgetPanelOpen,
      notifications, addNotification, clearNotifications,
      windows, activeWindowId,
      focusWindow, openApp, closeWindow, minimizeWindow, maximizeWindow,
      updateWindowPosition, updateWindowSize,
      filesystem, findNodeById, createFSItem, deleteFSItem, emptyTrash,
      restartOS, shutdownOS
    }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within OSProvider');
  return context;
};
