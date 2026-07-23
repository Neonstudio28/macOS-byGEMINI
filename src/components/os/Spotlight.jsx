import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import {
  Search,
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
  Clock,
  Globe,
  Mail,
  MessageSquare,
  Map,
  Calendar,
  ChevronRight,
} from 'lucide-react';

// ─── App Registry ──────────────────────────────────────────────────────────────

const APPS = [
  {
    key: 'finder',
    title: 'Finder',
    desc: 'File Manager',
    icon: Folder,
    color: '#4facfe',
    bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    category: 'Applications',
  },
  {
    key: 'safari',
    title: 'Safari',
    desc: 'Web Browser',
    icon: Compass,
    color: '#2980b9',
    bg: 'linear-gradient(135deg, #2980b9 0%, #6dd5fa 100%)',
    category: 'Applications',
  },
  {
    key: 'terminal',
    title: 'Terminal',
    desc: 'Command Shell',
    icon: Terminal,
    color: '#b2b2b2',
    bg: 'linear-gradient(135deg, #2d2d2d 0%, #555 100%)',
    category: 'Applications',
  },
  {
    key: 'notes',
    title: 'Notes',
    desc: 'Markdown Notes App',
    icon: FileText,
    color: '#f5a623',
    bg: 'linear-gradient(135deg, #f5a623 0%, #f9d423 100%)',
    category: 'Applications',
  },
  {
    key: 'music',
    title: 'Music',
    desc: 'Music Player',
    icon: Music,
    color: '#fc2b6d',
    bg: 'linear-gradient(135deg, #fc2b6d 0%, #ff6b6b 100%)',
    category: 'Applications',
  },
  {
    key: 'photos',
    title: 'Photos',
    desc: 'Photo Library',
    icon: ImageIcon,
    color: '#a855f7',
    bg: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    category: 'Applications',
  },
  {
    key: 'code',
    title: 'Code Editor',
    desc: 'JavaScript IDE',
    icon: Code,
    color: '#06b6d4',
    bg: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    category: 'Applications',
  },
  {
    key: 'calculator',
    title: 'Calculator',
    desc: 'Math Calculator',
    icon: Calculator,
    color: '#10b981',
    bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    category: 'Applications',
  },
  {
    key: 'arcade',
    title: 'Arcade',
    desc: 'Games',
    icon: Gamepad2,
    color: '#d946ef',
    bg: 'linear-gradient(135deg, #d946ef 0%, #7c3aed 100%)',
    category: 'Applications',
  },
  {
    key: 'settings',
    title: 'System Settings',
    desc: 'Preferences & Configuration',
    icon: Sliders,
    color: '#64748b',
    bg: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
    category: 'Applications',
  },
];

const CATEGORIES = [
  { id: 'top', label: 'Top Hit' },
  { id: 'Applications', label: 'Applications' },
  { id: 'Documents', label: 'Documents' },
  { id: 'Folders', label: 'Folders' },
  { id: 'Web', label: 'Websites' },
  { id: 'Messages', label: 'Messages' },
];

// ─── AppIcon ───────────────────────────────────────────────────────────────────

const AppIcon = ({ app, size = 32 }) => {
  const Icon = app.icon;
  return (
    <div
      className="flex items-center justify-center rounded-[22%] shrink-0 shadow-md"
      style={{
        width: size,
        height: size,
        background: app.bg,
      }}
    >
      <Icon size={size * 0.52} color="white" strokeWidth={1.8} />
    </div>
  );
};

// ─── Math evaluation ───────────────────────────────────────────────────────────

function tryMath(q) {
  if (!/^[0-9+\-*/().%\s]+$/.test(q) || q.trim().length < 2) return null;
  try {
    // eslint-disable-next-line no-new-func
    const r = Function(`'use strict'; return (${q})`)();
    if (typeof r === 'number' && isFinite(r)) return r;
  } catch (_) {}
  return null;
}

// ─── Spotlight ─────────────────────────────────────────────────────────────────

export const Spotlight = () => {
  const { spotlightOpen, setSpotlightOpen, openApp } = useOS();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Applications');
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Reset on open/close
  useEffect(() => {
    if (spotlightOpen) {
      setQuery('');
      setSelectedIdx(0);
      setActiveCategory('Applications');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [spotlightOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && spotlightOpen) {
        setSpotlightOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [spotlightOpen, setSpotlightOpen]);

  if (!spotlightOpen) return null;

  const mathResult = tryMath(query);

  const filtered = query.trim()
    ? APPS.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.desc.toLowerCase().includes(query.toLowerCase())
      )
    : APPS.slice(0, 5);

  const topHit = filtered[0] || null;

  // Keyboard nav
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIdx]) {
        handleLaunch(filtered[selectedIdx].key);
      }
    }
  };

  const handleLaunch = (key) => {
    openApp(key);
    setSpotlightOpen(false);
    setQuery('');
  };

  const hasResults = filtered.length > 0 || mathResult !== null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[300] flex items-start justify-center"
      style={{ paddingTop: '15vh' }}
      onClick={() => setSpotlightOpen(false)}
    >
      {/* Frosted glass panel */}
      <div
        ref={panelRef}
        className="relative w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top"
        style={{
          maxWidth: '680px',
          borderRadius: '14px',
          background: 'rgba(28, 28, 30, 0.75)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 2px 0 rgba(255,255,255,0.08) inset',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Search Bar ── */}
        <div className="flex items-center px-4 py-3 gap-3 border-b border-white/10">
          <Search
            size={20}
            className="shrink-0"
            style={{ color: hasResults ? '#fff' : 'rgba(255,255,255,0.35)' }}
            strokeWidth={2.5}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Spotlight Search"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/35"
            style={{
              fontSize: '20px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="shrink-0 w-5 h-5 rounded-full bg-white/20 text-white/60 text-xs flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Body: Sidebar + Results ── */}
        {hasResults && (
          <div className="flex" style={{ minHeight: '320px', maxHeight: '480px' }}>
            {/* Sidebar categories */}
            <div
              className="flex flex-col py-2 shrink-0 border-r border-white/10"
              style={{ width: '168px', background: 'rgba(0,0,0,0.15)' }}
            >
              {CATEGORIES.map((cat) => {
                const hasItems =
                  cat.id === 'top'
                    ? !!topHit
                    : filtered.some((a) => a.category === cat.id);
                if (!hasItems && cat.id !== 'top') return null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-4 py-[5px] text-[12px] font-semibold transition-colors rounded-md mx-1 my-0.5
                      ${activeCategory === cat.id
                        ? 'bg-[#007AFF] text-white'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/10'
                      }`}
                    style={{ width: 'calc(100% - 8px)' }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Results panel */}
            <div className="flex-1 overflow-y-auto py-2 px-2">
              {/* Math result */}
              {mathResult !== null && (
                <div
                  className="mx-1 mb-2 p-3 rounded-xl flex items-center justify-between"
                  style={{ background: 'rgba(0, 122, 255, 0.15)', border: '1px solid rgba(0,122,255,0.3)' }}
                >
                  <div>
                    <div className="text-[11px] text-blue-300 font-semibold mb-0.5">Calculator</div>
                    <div className="text-white/70 text-sm font-mono">{query} =</div>
                  </div>
                  <div className="text-white text-2xl font-light font-mono">{mathResult}</div>
                </div>
              )}

              {/* Top hit */}
              {(activeCategory === 'top' || activeCategory === 'Applications') && topHit && (
                <div className="mb-1">
                  {activeCategory === 'top' && (
                    <div className="px-3 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-widest">
                      Top Hit
                    </div>
                  )}
                  {/* Large top-hit card */}
                  {activeCategory === 'top' ? (
                    <button
                      onClick={() => handleLaunch(topHit.key)}
                      className="w-full rounded-xl p-3 flex items-center gap-4 hover:bg-white/10 transition-colors group text-left"
                    >
                      <AppIcon app={topHit} size={56} />
                      <div>
                        <div className="text-white font-semibold text-base">{topHit.title}</div>
                        <div className="text-white/50 text-[12px]">{topHit.desc}</div>
                        <div className="text-white/30 text-[11px] mt-1">Application</div>
                      </div>
                    </button>
                  ) : null}
                </div>
              )}

              {/* Applications list */}
              {(activeCategory === 'Applications' || !CATEGORIES.find(c => c.id === activeCategory)) && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-widest">
                    Applications
                  </div>
                  {filtered.map((app, idx) => (
                    <button
                      key={app.key}
                      onClick={() => handleLaunch(app.key)}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group
                        ${selectedIdx === idx ? 'bg-[#007AFF]' : 'hover:bg-white/10'}`}
                    >
                      <AppIcon app={app} size={32} />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-[13px] font-medium truncate ${selectedIdx === idx ? 'text-white' : 'text-white/90'}`}
                        >
                          {app.title}
                        </div>
                        <div
                          className={`text-[11px] truncate ${selectedIdx === idx ? 'text-white/80' : 'text-white/45'}`}
                        >
                          {app.desc}
                        </div>
                      </div>
                      <ChevronRight
                        size={13}
                        className={`shrink-0 ${selectedIdx === idx ? 'text-white/70' : 'text-white/20'}`}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {filtered.length === 0 && mathResult === null && (
                <div className="flex flex-col items-center justify-center py-12 text-white/30">
                  <Search size={28} strokeWidth={1.5} className="mb-3 opacity-40" />
                  <div className="text-sm">No results for "{query}"</div>
                  <div className="text-[11px] mt-1 opacity-70">Try a different search term</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Empty / initial state ── */}
        {!hasResults && !query && (
          <div className="py-6 px-4">
            <div className="text-[11px] text-white/35 uppercase tracking-widest font-semibold mb-3 px-1">
              Suggested
            </div>
            <div className="grid grid-cols-4 gap-2">
              {APPS.slice(0, 8).map((app) => (
                <button
                  key={app.key}
                  onClick={() => handleLaunch(app.key)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <AppIcon app={app} size={40} />
                  <span className="text-[11px] text-white/60 group-hover:text-white/90 transition-colors truncate max-w-full text-center">
                    {app.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer hint ── */}
        <div
          className="flex items-center justify-between px-4 py-2 border-t border-white/8 text-[11px] text-white/25"
          style={{ borderTopColor: 'rgba(255,255,255,0.06)' }}
        >
          <span>Search the web, apps, documents, and more</span>
          <div className="flex items-center gap-2">
            <kbd className="px-1 py-0.5 rounded bg-white/10 text-white/40 text-[10px]">↑↓</kbd>
            <span className="text-white/20">navigate</span>
            <kbd className="px-1 py-0.5 rounded bg-white/10 text-white/40 text-[10px]">↵</kbd>
            <span className="text-white/20">open</span>
            <kbd className="px-1 py-0.5 rounded bg-white/10 text-white/40 text-[10px]">esc</kbd>
            <span className="text-white/20">dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
};
