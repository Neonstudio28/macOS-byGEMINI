import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useOS } from '../../context/OSContext';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { sounds } from '../../utils/soundEngine';

export const WindowFrame = ({ windowObj, children }) => {
  const { 
    activeWindowId, 
    focusWindow, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow,
    updateWindowPosition,
    updateWindowSize,
    glassOpacity,
    resolvedTheme
  } = useOS();

  const isActive = activeWindowId === windowObj.id;
  const isMinimized = windowObj.isMinimized;
  const isMaximized = windowObj.isMaximized;

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0, direction: '' });

  // Double-click title bar to maximize/restore
  const handleTitlebarDoubleClick = (e) => {
    if (!e.target.closest('.traffic-group')) {
      maximizeWindow(windowObj.id);
    }
  };

  const handleHeaderMouseDown = (e) => {
    if (e.target.closest('.traffic-group') || isMaximized) return;
    focusWindow(windowObj.id);
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: windowObj.x,
      initialY: windowObj.y
    };
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - 120, dragRef.current.initialX + dx));
      const newY = Math.max(24, Math.min(window.innerHeight - 60, dragRef.current.initialY + dy));
      updateWindowPosition(windowObj.id, newX, newY);
    } else if (isResizing) {
      const dx = e.clientX - resizeRef.current.startX;
      const dy = e.clientY - resizeRef.current.startY;
      let newW = resizeRef.current.startW;
      let newH = resizeRef.current.startH;

      if (resizeRef.current.direction.includes('e')) newW = Math.max(340, resizeRef.current.startW + dx);
      if (resizeRef.current.direction.includes('s')) newH = Math.max(220, resizeRef.current.startH + dy);
      if (resizeRef.current.direction.includes('w')) {
        const clampedW = Math.max(340, resizeRef.current.startW - dx);
        updateWindowPosition(windowObj.id, resizeRef.current.initialX + (resizeRef.current.startW - clampedW), windowObj.y);
        newW = clampedW;
      }

      updateWindowSize(windowObj.id, newW, newH);
    }
  }, [isDragging, isResizing, windowObj.id]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : 'se-resize';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    focusWindow(windowObj.id);
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: windowObj.width,
      startH: windowObj.height,
      initialX: windowObj.x,
      direction
    };
  };

  const handleClose = (e) => {
    e.stopPropagation();
    try { sounds.playClick(); } catch(err) {}
    closeWindow(windowObj.id);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    try { sounds.playClick(); } catch(err) {}
    minimizeWindow(windowObj.id);
  };

  const handleMaximize = (e) => {
    e.stopPropagation();
    try { sounds.playClick(); } catch(err) {}
    maximizeWindow(windowObj.id);
  };

  const isLight = resolvedTheme === 'light';

  const frameStyle = isMaximized ? {
    top: '24px',
    left: '0px',
    width: '100vw',
    height: 'calc(100vh - 24px)',
    zIndex: windowObj.zIndex,
    borderRadius: '0px'
  } : {
    top: `${windowObj.y}px`,
    left: `${windowObj.x}px`,
    width: `${windowObj.width}px`,
    height: `${windowObj.height}px`,
    zIndex: windowObj.zIndex,
    borderRadius: '14px'
  };

  return (
    <div 
      style={{
        ...frameStyle,
        backgroundColor: isLight 
          ? `rgba(246, 246, 248, ${Math.min(0.96, (glassOpacity || 0.75) + 0.15)})`
          : `rgba(22, 22, 25, ${Math.min(0.96, (glassOpacity || 0.75) + 0.18)})`
      }}
      onClick={() => focusWindow(windowObj.id)}
      className={`fixed flex flex-col overflow-hidden window-transition macos-glass ${
        isMinimized ? 'window-minimized' : ''
      } ${
        isActive 
          ? isLight ? 'ring-1 ring-black/15 border-black/20 shadow-2xl' : 'ring-1 ring-white/20 border-white/25 shadow-2xl'
          : isLight ? 'ring-1 ring-black/10 border-black/10 opacity-95' : 'ring-1 ring-white/8 border-white/10 opacity-92'
      }`}
    >
      {/* macOS Authentic Titlebar */}
      <div 
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={handleTitlebarDoubleClick}
        className={`h-9 px-3 flex items-center justify-between select-none border-b flex-shrink-0 relative ${
          isActive 
            ? isLight ? 'bg-gradient-to-b from-black/5 to-black/10 border-black/10' : 'window-titlebar border-white/12' 
            : isLight ? 'bg-slate-200/80 border-black/5' : 'bg-[#252528]/90 border-white/8'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ backdropFilter: isActive ? 'blur(40px) saturate(200%)' : 'none' }}
      >
        {/* Traffic Lights */}
        <div className="flex items-center gap-2 traffic-group w-16 flex-shrink-0 z-10">
          <button 
            onClick={handleClose}
            className="traffic-light bg-[#FF5F57] text-[#4C0000]"
            title="Close (⌘W)"
            style={{ border: '0.5px solid rgba(0,0,0,0.18)' }}
          >
            <X size={7} strokeWidth={3} />
          </button>
          <button 
            onClick={handleMinimize}
            className="traffic-light bg-[#FEBC2E] text-[#5A3800]"
            title="Minimize (⌘M)"
            style={{ border: '0.5px solid rgba(0,0,0,0.18)' }}
          >
            <Minus size={7} strokeWidth={3} />
          </button>
          <button 
            onClick={handleMaximize}
            className="traffic-light bg-[#28C840] text-[#0A4810]"
            title={isMaximized ? "Restore (⌃⌘F)" : "Fullscreen (⌃⌘F)"}
            style={{ border: '0.5px solid rgba(0,0,0,0.18)' }}
          >
            {isMaximized 
              ? <Minimize2 size={7} strokeWidth={3} /> 
              : <Maximize2 size={7} strokeWidth={3} />
            }
          </button>
        </div>

        {/* Centered Window Title */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
          <span className={`text-[13px] font-semibold tracking-tight truncate max-w-xs ${
            isActive ? isLight ? 'text-slate-900 font-bold' : 'text-white/90' : isLight ? 'text-slate-600' : 'text-white/45'
          }`}>
            {windowObj.title}
          </span>
        </div>

        {/* Right spacer for symmetry */}
        <div className="w-16 flex-shrink-0" />
      </div>

      {/* Window Main Content Area */}
      <div className={`flex-1 overflow-hidden relative font-sans min-h-0 ${isLight ? 'bg-white/90 text-slate-900' : 'text-white/92'}`}>
        {children}
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-30"
            style={{ background: 'transparent' }}
          />
          <div 
            onMouseDown={(e) => handleResizeStart(e, 's')}
            className="absolute bottom-0 left-4 right-4 h-1.5 cursor-s-resize z-20"
          />
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            className="absolute top-9 right-0 w-1.5 bottom-4 cursor-e-resize z-20"
          />
        </>
      )}
    </div>
  );
};
