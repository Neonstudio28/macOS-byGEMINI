import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  Folder, 
  FileText, 
  Trash2, 
  Gamepad2, 
  Sliders, 
  HardDrive, 
  Plus, 
  Sparkles,
  Compass,
  Terminal,
  Code,
  MessageSquare,
  Mail,
  Store,
  Activity,
  Grid,
  Video,
  Users
} from 'lucide-react';
import { WidgetGalleryModal } from './WidgetGalleryModal';
import { DesktopWidgetRenderer } from './DesktopWidgets';

const INITIAL_DESKTOP_WIDGETS = [
  { id: 'w1', type: 'clock', size: 'small', x: 20, y: 40 },
  { id: 'w2', type: 'weather', size: 'medium', x: 180, y: 40 }
];

export const Desktop = () => {
  const { 
    wallpaper, 
    openApp, 
    filesystem, 
    createFSItem, 
    emptyTrash, 
    setSpotlightOpen,
    brightness
  } = useOS();

  const [contextMenu, setContextMenu] = useState(null);
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [desktopWidgets, setDesktopWidgets] = useState(() => {
    const saved = localStorage.getItem('macos_tahoe_desktop_widgets');
    return saved ? JSON.parse(saved) : INITIAL_DESKTOP_WIDGETS;
  });

  useEffect(() => {
    localStorage.setItem('macos_tahoe_desktop_widgets', JSON.stringify(desktopWidgets));
  }, [desktopWidgets]);

  const desktopFolder = filesystem.children?.find(c => c.id === 'desktop');
  const desktopFiles = desktopFolder?.children || [];

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDesktopClick = () => {
    if (contextMenu) setContextMenu(null);
    setSelectedIconId(null);
  };

  const handleAddWidget = (widgetCatalogItem) => {
    const newWidget = {
      id: `w-${Date.now()}`,
      type: widgetCatalogItem.type,
      size: widgetCatalogItem.size,
      x: 20 + (desktopWidgets.length * 30),
      y: 200
    };
    setDesktopWidgets(prev => [...prev, newWidget]);
  };

  const handleRemoveWidget = (id) => {
    setDesktopWidgets(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div 
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      className="fixed inset-0 top-6 bottom-0 z-0 select-none overflow-hidden"
      style={{
        filter: `brightness(${brightness}%)`,
        transition: 'filter 0.3s ease'
      }}
    >
      {/* Background Wallpaper Renderer */}
      <div 
        className="absolute inset-0 w-full h-full transition-all duration-700"
        style={wallpaper.type === 'gradient' ? { background: wallpaper.bgStyle } : { backgroundImage: `url(${wallpaper.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Subtle Liquid Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />
      </div>

      {/* Pinned Desktop Widgets Area */}
      <div className="absolute right-6 top-6 z-10 flex flex-col gap-4 items-end pointer-events-auto">
        {desktopWidgets.map(w => (
          <DesktopWidgetRenderer key={w.id} widget={w} onRemove={handleRemoveWidget} />
        ))}
      </div>

      {/* Desktop Grid Icons */}
      <div className="relative z-10 p-6 grid grid-flow-col grid-rows-6 gap-6 max-w-fit">
        {[
          { id: 'app-finder', title: 'Finder', appKey: 'finder', icon: Folder, img: '/icons/finder.jpg', color: 'text-sky-400' },
          { id: 'app-safari', title: 'Safari', appKey: 'safari', icon: Compass, img: '/icons/safari.jpg', color: 'text-cyan-400' },
          { id: 'app-facetime', title: 'FaceTime', appKey: 'facetime', icon: Video, img: '/icons/facetime.jpg', color: 'text-emerald-400' },
          { id: 'app-messages', title: 'Messages', appKey: 'messages', icon: MessageSquare, img: '/icons/messages.jpg', color: 'text-emerald-400' },
          { id: 'app-mail', title: 'Mail', appKey: 'mail', icon: Mail, img: '/icons/mail.jpg', color: 'text-blue-400' },
          { id: 'app-contacts', title: 'Contacts', appKey: 'contacts', icon: Users, color: 'text-blue-400' },
          { id: 'app-appstore', title: 'App Store', appKey: 'appstore', icon: Store, img: '/icons/appstore.jpg', color: 'text-sky-400' },
          { id: 'app-terminal', title: 'Terminal', appKey: 'terminal', icon: Terminal, img: '/icons/terminal.jpg', color: 'text-slate-300' },
          { id: 'app-code', title: 'Xcode', appKey: 'code', icon: Code, color: 'text-blue-400' },
          { id: 'app-arcade', title: 'Arcade Pong', appKey: 'arcade', icon: Gamepad2, color: 'text-fuchsia-400' },
          { id: 'app-activitymonitor', title: 'Activity', appKey: 'activitymonitor', icon: Activity, color: 'text-emerald-400' },
        ].map((item) => {
          const Icon = item.icon;
          const isSel = selectedIconId === item.id;
          return (
            <div
              key={item.id}
              onClick={(e) => { e.stopPropagation(); setSelectedIconId(item.id); }}
              onDoubleClick={(e) => { e.stopPropagation(); openApp(item.appKey); }}
              className={`w-20 flex flex-col items-center p-2 rounded-xl cursor-pointer transition-all border ${
                isSel 
                  ? 'bg-[#007AFF]/30 border-[#007AFF]/60 shadow-xl backdrop-blur-md scale-105' 
                  : 'hover:bg-white/10 border-transparent'
              }`}
            >
              <div className="w-12 h-12 rounded-[22.37%] overflow-hidden shadow-lg border border-white/20 mb-1.5 flex items-center justify-center bg-slate-900">
                {item.img ? (
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <Icon size={26} className={item.color} />
                )}
              </div>
              <span className="text-[11px] font-medium text-center text-slate-100 drop-shadow-md line-clamp-2">
                {item.title}
              </span>
            </div>
          );
        })}

        {/* Filesystem Desktop Items */}
        {desktopFiles.map((file) => {
          const isSel = selectedIconId === file.id;
          return (
            <div
              key={file.id}
              onClick={(e) => { e.stopPropagation(); setSelectedIconId(file.id); }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (file.fileType === 'code') openApp('code', { fileContent: file.content, fileName: file.name });
                else openApp('finder', { currentFolderId: 'desktop' });
              }}
              className={`w-20 flex flex-col items-center p-2 rounded-xl cursor-pointer transition-all border ${
                isSel 
                  ? 'bg-[#007AFF]/30 border-[#007AFF]/60 shadow-xl backdrop-blur-md scale-105' 
                  : 'hover:bg-white/10 border-transparent'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-white/20 shadow-lg backdrop-blur-md mb-1.5 flex items-center justify-center">
                {file.type === 'folder' ? <Folder size={26} className="text-sky-400" /> : <FileText size={26} className="text-amber-400" />}
              </div>
              <span className="text-[11px] font-medium text-center text-slate-100 drop-shadow-md line-clamp-2">
                {file.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Widget Gallery Modal */}
      <WidgetGalleryModal 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        onAddWidget={handleAddWidget} 
      />

      {/* Desktop Context Menu */}
      {contextMenu && (
        <div 
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed w-48 macos-menu p-1.5 shadow-2xl z-50 text-slate-200 text-xs border border-white/20 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => { createFSItem('desktop', 'New Folder', 'folder'); setContextMenu(null); }}
            className="w-full text-left px-3 py-1.5 rounded-md hover:bg-[#007AFF] hover:text-white flex items-center gap-2 transition-colors"
          >
            <Plus size={14} /> New Folder
          </button>
          <button 
            onClick={() => { setGalleryOpen(true); setContextMenu(null); }}
            className="w-full text-left px-3 py-1.5 rounded-md hover:bg-[#007AFF] hover:text-white flex items-center gap-2 transition-colors"
          >
            <Grid size={14} className="text-cyan-400" /> Edit Widgets...
          </button>
          <button 
            onClick={() => { createFSItem('desktop', 'Untitled.txt', 'file', 'text', 'Created from desktop context menu.'); setContextMenu(null); }}
            className="w-full text-left px-3 py-1.5 rounded-md hover:bg-[#007AFF] hover:text-white flex items-center gap-2 transition-colors"
          >
            <FileText size={14} /> New Text Note
          </button>

          <div className="my-1 border-t border-white/10" />

          <button 
            onClick={() => { openApp('settings'); setContextMenu(null); }}
            className="w-full text-left px-3 py-1.5 rounded-md hover:bg-[#007AFF] hover:text-white flex items-center gap-2 transition-colors"
          >
            <Sliders size={14} /> Change Wallpaper...
          </button>
          <button 
            onClick={() => { setSpotlightOpen(true); setContextMenu(null); }}
            className="w-full text-left px-3 py-1.5 rounded-md hover:bg-[#007AFF] hover:text-white flex items-center gap-2 transition-colors"
          >
            <Sparkles size={14} /> Spotlight Search...
          </button>

          <div className="my-1 border-t border-white/10" />

          <button 
            onClick={() => { emptyTrash(); setContextMenu(null); }}
            className="w-full text-left px-3 py-1.5 rounded-md hover:bg-[#007AFF] hover:text-white flex items-center gap-2 transition-colors text-rose-300 hover:text-white"
          >
            <Trash2 size={14} /> Empty Trash
          </button>
        </div>
      )}
    </div>
  );
};
