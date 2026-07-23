import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, RotateCw, Lock, Plus, X, 
  Star, Share2, BookOpen, Search, ExternalLink,
  Bookmark, Download, ZoomIn, ZoomOut, Menu
} from 'lucide-react';
import { sounds } from '../utils/soundEngine';

// ─── Page renderers ───────────────────────────────────────────────────────────

const ApplePage = ({ query }) => (
  <div className="min-h-full bg-white text-gray-900 font-sans">
    <nav className="bg-[#1d1d1f]/95 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <span className="text-white text-lg">  </span>
      <div className="flex gap-6 text-[#f5f5f7] text-xs font-medium">
        {['Store','Mac','iPad','iPhone','Watch','AirPods','TV & Home','Entertainment','Accessories','Support'].map(item => (
          <span key={item} className="hover:text-white/70 cursor-pointer transition-colors">{item}</span>
        ))}
      </div>
      <Search size={14} className="text-white/70" />
    </nav>

    <div className="bg-[#1d1d1f] text-center py-16 px-8 space-y-4">
      <p className="text-[#f5f5f7]/60 text-sm tracking-widest font-medium">NEW</p>
      <h1 className="text-5xl font-black text-white">macOS 26 Tahoe</h1>
      <p className="text-xl text-[#f5f5f7]/80">Liquid Glass. Redefined.</p>
      <div className="flex justify-center gap-4 mt-6">
        <button className="px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-sm font-semibold hover:bg-blue-500 transition-colors">Learn more ›</button>
        <button className="px-6 py-2.5 rounded-full border border-[#0071e3] text-[#0071e3] text-sm font-semibold hover:bg-blue-950 transition-colors">Download</button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-px bg-[#d2d2d7] mx-0">
      {[
        { title: 'MacBook Pro', sub: 'Supercharged by M4 Pro', bg: 'bg-[#f5f5f7]', img: '💻', color: 'text-gray-900' },
        { title: 'iPhone 16 Pro', sub: 'A18 Pro. Camera Control.', bg: 'bg-[#1d1d1f]', img: '📱', color: 'text-white' },
        { title: 'iPad Pro', sub: 'Thin. Powerful. Magical.', bg: 'bg-[#f5f5f7]', img: '📱', color: 'text-gray-900' },
        { title: 'Apple Watch', sub: 'The ultimate sports watch.', bg: 'bg-black', img: '⌚', color: 'text-white' },
      ].map(card => (
        <div key={card.title} className={`${card.bg} p-10 flex flex-col items-center text-center cursor-pointer group`}>
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{card.img}</div>
          <h2 className={`text-xl font-bold ${card.color}`}>{card.title}</h2>
          <p className={`text-sm mt-1 ${card.color === 'text-white' ? 'text-gray-400' : 'text-gray-500'}`}>{card.sub}</p>
          <a className="text-[#0071e3] text-xs mt-3 hover:underline">Learn more ›</a>
        </div>
      ))}
    </div>
  </div>
);

const GooglePage = ({ onSearch }) => {
  const [q, setQ] = useState('');
  return (
    <div className="min-h-full bg-white flex flex-col">
      <div className="flex justify-end gap-4 p-3 text-xs text-gray-700">
        {['Gmail','Images','Maps','Search Labs'].map(l => <a key={l} className="hover:underline cursor-pointer">{l}</a>)}
        <button className="px-4 py-1.5 rounded-full bg-[#1a73e8] text-white font-medium hover:bg-blue-600">Sign in</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center pb-20 px-6 space-y-6">
        <div className="text-6xl font-black tracking-tight">
          <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
        </div>
        <form onSubmit={e => { e.preventDefault(); if (q) onSearch(`https://www.google.com/search?q=${encodeURIComponent(q)}`); }} className="w-full max-w-lg">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-gray-300 hover:shadow-md focus-within:shadow-md transition-shadow bg-white">
            <Search size={18} className="text-gray-400" />
            <input
              autoFocus type="text" value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search Google or type a URL"
              className="flex-1 focus:outline-none text-sm text-gray-800"
            />
          </div>
        </form>
        <div className="flex gap-3">
          {['Google Search','I\'m Feeling Lucky'].map(btn => (
            <button key={btn} className="px-4 py-2 rounded bg-[#f8f9fa] hover:bg-gray-200 text-sm text-gray-700 font-medium border border-gray-200 transition-colors">{btn}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchResultsPage = ({ query }) => {
  const q = query.split('q=')[1]?.split('&')[0];
  const decoded = q ? decodeURIComponent(q) : 'search';
  const results = [
    { title: `${decoded} - Wikipedia`, url: `en.wikipedia.org/wiki/${decoded}`, desc: `Wikipedia article about ${decoded}. The free encyclopedia that anyone can edit.` },
    { title: `${decoded} - Apple Developer`, url: `developer.apple.com/search/?q=${decoded}`, desc: `Official Apple developer documentation for ${decoded}. Guides, references, sample code.` },
    { title: `Best ${decoded} resources - Stack Overflow`, url: `stackoverflow.com/questions/${decoded}`, desc: `Community answers and discussions about ${decoded} on Stack Overflow.` },
    { title: `${decoded} - MDN Web Docs`, url: `developer.mozilla.org/en-US/${decoded}`, desc: `MDN documentation: comprehensive reference for web technologies including ${decoded}.` },
    { title: `GitHub - search results for ${decoded}`, url: `github.com/search?q=${decoded}`, desc: `Open source repositories and code related to ${decoded} on GitHub.` },
  ];
  return (
    <div className="min-h-full bg-white font-sans text-gray-900 text-sm">
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="text-2xl font-black"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></div>
        <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:shadow focus-within:shadow max-w-xl">
          <Search size={14} className="text-gray-400" />
          <span className="text-sm text-gray-800">{decoded}</span>
        </div>
        <div className="flex gap-4 text-xs text-gray-600">{['All','Images','News','Videos','Maps'].map(f => <span key={f} className="cursor-pointer hover:text-[#1a73e8] first:text-[#1a73e8] first:border-b first:border-[#1a73e8] pb-1">{f}</span>)}</div>
      </div>
      <div className="px-16 py-6 space-y-6">
        <p className="text-xs text-gray-500">About {(Math.random() * 5 + 1).toFixed(2)} billion results (0.{Math.floor(Math.random()*9)+1}2 seconds)</p>
        {results.map((r, i) => (
          <div key={i} className="max-w-2xl space-y-1">
            <div className="text-xs text-[#006621] truncate">https://{r.url}</div>
            <div className="text-[#1a0dab] text-base cursor-pointer hover:underline font-medium">{r.title}</div>
            <p className="text-gray-600 text-sm leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const StartPage = ({ onNavigate }) => {
  const favorites = [
    { name: 'Apple', url: 'https://apple.com', emoji: '', bg: 'bg-gray-100' },
    { name: 'Google', url: 'https://google.com', emoji: '🔍', bg: 'bg-white' },
    { name: 'GitHub', url: 'https://github.com', emoji: '🐙', bg: 'bg-gray-900' },
    { name: 'MDN', url: 'https://developer.mozilla.org', emoji: '📚', bg: 'bg-blue-900' },
    { name: 'YouTube', url: 'https://youtube.com', emoji: '▶️', bg: 'bg-red-600' },
    { name: 'Wikipedia', url: 'https://wikipedia.org', emoji: '🌐', bg: 'bg-gray-50' },
  ];
  return (
    <div className="min-h-full bg-[#1C1C1E] flex flex-col items-center py-16 px-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Start Page</h1>
      <div className="grid grid-cols-6 gap-4">
        {favorites.map(f => (
          <button key={f.name} onClick={() => onNavigate(f.url)} className="flex flex-col items-center gap-2 group">
            <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center text-2xl shadow-lg border border-white/10 group-hover:scale-110 transition-transform`}>
              {f.emoji}
            </div>
            <span className="text-[11px] text-white/60 group-hover:text-white">{f.name}</span>
          </button>
        ))}
      </div>
      <div className="w-full max-w-2xl p-4 rounded-2xl bg-white/5 border border-white/8 space-y-2">
        <h3 className="text-xs font-bold text-white/60 uppercase tracking-wide">Privacy Report</h3>
        <p className="text-xs text-white/50">Safari blocked 12 trackers this week, keeping your browsing private.</p>
      </div>
    </div>
  );
};

const GenericPage = ({ url }) => (
  <div className="min-h-full bg-white flex flex-col items-center justify-center p-12 space-y-4 text-gray-900 font-sans">
    <ExternalLink size={40} className="text-gray-300" />
    <h2 className="text-xl font-bold text-gray-700">{url.replace('https://', '').split('/')[0]}</h2>
    <p className="text-sm text-gray-500 text-center max-w-md">
      This page is being rendered inside macOS 26 Tahoe Safari. For security, external content is sandboxed.
    </p>
    <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 font-mono break-all max-w-lg">{url}</div>
  </div>
);

const renderPage = (url, onNavigate) => {
  if (url.includes('apple.com')) return <ApplePage />;
  if (url.includes('google.com/search')) return <SearchResultsPage query={url} />;
  if (url.includes('google.com')) return <GooglePage onSearch={onNavigate} />;
  if (url === 'about:newtab' || url === '') return <StartPage onNavigate={onNavigate} />;
  return <GenericPage url={url} />;
};

// ─── Main Safari ──────────────────────────────────────────────────────────────
export const ValSafari = () => {
  const [tabs, setTabs] = useState([
    { id: 't1', title: 'macOS Tahoe — Apple', url: 'https://apple.com', favicon: '' },
    { id: 't2', title: 'Google Search', url: 'https://google.com', favicon: '🔍' },
  ]);
  const [activeTabId, setActiveTabId] = useState('t1');
  const [urlInput, setUrlInput] = useState('https://apple.com');
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([
    { label: ' Apple', url: 'https://apple.com' },
    { label: '🔍 Google', url: 'https://google.com' },
    { label: '📰 News', url: 'https://news.apple.com' },
    { label: '💻 Developer', url: 'https://developer.apple.com' },
  ]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleNavigate = (newUrl) => {
    sounds.playClick();
    let formatted = newUrl.trim();
    if (!formatted.startsWith('http')) {
      formatted = formatted.includes('.') ? `https://${formatted}` : `https://www.google.com/search?q=${encodeURIComponent(formatted)}`;
    }
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 400);
    setTabs(prev => prev.map(t => t.id === activeTabId ? {
      ...t,
      url: formatted,
      title: formatted.replace(/https?:\/\//, '').split('/')[0],
    } : t));
    setUrlInput(formatted);
  };

  const addTab = () => {
    const id = Date.now().toString();
    setTabs(prev => [...prev, { id, title: 'New Tab', url: 'about:newtab', favicon: '' }]);
    setActiveTabId(id);
    setUrlInput('');
    sounds.playClick();
  };

  const closeTab = (id, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const rest = tabs.filter(t => t.id !== id);
    setTabs(rest);
    if (activeTabId === id) { setActiveTabId(rest[0].id); setUrlInput(rest[0].url); }
  };

  const toggleBookmark = () => {
    const already = bookmarks.some(b => b.url === activeTab.url);
    if (already) {
      setBookmarks(b => b.filter(x => x.url !== activeTab.url));
    } else {
      setBookmarks(b => [...b, { label: activeTab.title.slice(0, 12), url: activeTab.url }]);
    }
    sounds.playClick();
  };

  const isBookmarked = bookmarks.some(b => b.url === activeTab.url);

  return (
    <div className="flex flex-col h-full w-full bg-[#1C1C1E] text-white select-none font-sans overflow-hidden">
      {/* Chrome */}
      <div className="bg-[#252528] border-b border-white/8 flex flex-col flex-shrink-0">
        {/* Tab strip */}
        <div className="flex items-center pl-2 pr-2 pt-1.5 gap-0.5 overflow-x-auto">
          {tabs.map(t => {
            const isSel = t.id === activeTabId;
            return (
              <div
                key={t.id}
                onClick={() => { setActiveTabId(t.id); setUrlInput(t.url); }}
                className={`group h-7 px-3 rounded-t-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-all max-w-[180px] min-w-[100px] flex-shrink-0 ${
                  isSel ? 'bg-[#1C1C1E] text-white border-t border-x border-white/10' : 'text-white/50 hover:text-white/80 hover:bg-white/8'
                }`}
              >
                <span className="text-xs">{t.favicon || '🌐'}</span>
                <span className="truncate flex-1 text-[11px]">{t.title}</span>
                <button onClick={e => closeTab(t.id, e)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/20 rounded-full">
                  <X size={10} />
                </button>
              </div>
            );
          })}
          <button onClick={addTab} className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white transition-colors flex-shrink-0">
            <Plus size={13} />
          </button>
        </div>

        {/* URL bar row */}
        <div className="h-9 px-3 flex items-center gap-2 border-t border-white/5">
          <button className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white" onClick={() => handleNavigate(urlInput)}>
            <ArrowLeft size={14} />
          </button>
          <button className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white">
            <ArrowRight size={14} />
          </button>
          <button onClick={() => handleNavigate(urlInput)} className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white">
            <RotateCw size={13} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <form onSubmit={e => { e.preventDefault(); handleNavigate(urlInput); }} className="flex-1 flex items-center gap-2 px-3 py-1 rounded-lg bg-[#1C1C1E] border border-white/10 text-[11px] focus-within:border-[#007AFF] transition-colors">
            <Lock size={11} className="text-emerald-400 flex-shrink-0" />
            <input
              type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)}
              placeholder="Search or enter website name..."
              className="flex-1 bg-transparent text-white/80 focus:outline-none font-mono"
            />
          </form>

          <button onClick={toggleBookmark} className={`p-1 rounded hover:bg-white/10 transition-colors ${isBookmarked ? 'text-amber-400' : 'text-white/50 hover:text-white'}`}>
            <Star size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white">
            <Share2 size={14} />
          </button>
        </div>

        {/* Bookmarks bar */}
        <div className="h-6 px-4 border-t border-white/5 flex items-center gap-3 text-[11px]">
          {bookmarks.map((bm, i) => (
            <button key={i} onClick={() => handleNavigate(bm.url)} className="text-white/60 hover:text-white truncate max-w-[120px] transition-colors">{bm.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white">
        {isLoading ? (
          <div className="h-full flex items-center justify-center bg-[#1C1C1E]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#007AFF] border-t-transparent animate-spin" />
              <span className="text-xs text-white/40">Loading...</span>
            </div>
          </div>
        ) : renderPage(activeTab.url, handleNavigate)}
      </div>
    </div>
  );
};
