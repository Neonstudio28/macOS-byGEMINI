import React, { useState, useMemo } from 'react';
import { 
  Search, ChevronLeft, Star, Download, CheckCircle2, 
  Sparkles, ChevronRight, X, ExternalLink, Award,
  RefreshCw, Clock, Users, Shield, Zap
} from 'lucide-react';
import { useOS } from '../context/OSContext';
import { sounds } from '../utils/soundEngine';

// ─── Full App Catalog ─────────────────────────────────────────────────────────
const APP_CATALOG = [
  // ── System Apps (pre-installed) ──────────────────────────────────
  {
    id: 'finder', name: 'Finder', developer: 'Apple Inc.', category: 'Productivity',
    rating: 4.8, reviews: '142K', size: '18.3 MB', version: '15.5', price: 'Free',
    preinstalled: true, featured: false, new: false, appleArcade: false,
    icon: '🗂️',
    iconBg: 'from-blue-500 to-sky-400',
    description: 'The Finder is the home base for your Mac. Use it to browse, organize, and open files and folders. The Finder includes a Sidebar with quick access to your most used folders and iCloud Drive.',
    screenshots: ['bg-gradient-to-br from-sky-800 to-blue-900', 'bg-gradient-to-br from-blue-700 to-indigo-900', 'bg-gradient-to-br from-sky-900 to-slate-800'],
    whatsnew: 'Full support for macOS 26 Tahoe Liquid Glass material. New Quick Actions in toolbar.',
    tags: ['Files', 'Folders', 'Organization', 'iCloud'],
  },
  {
    id: 'safari', name: 'Safari', developer: 'Apple Inc.', category: 'Utilities',
    rating: 4.7, reviews: '398K', size: '67.2 MB', version: '18.4', price: 'Free',
    preinstalled: true, featured: true, new: false, appleArcade: false,
    icon: '🧭',
    iconBg: 'from-sky-500 to-blue-600',
    description: 'Safari is the world\'s fastest browser. Enjoy real privacy protection with Intelligent Tracking Prevention. Tab Groups help you keep your tabs organized and access them across devices.',
    screenshots: ['bg-gradient-to-br from-sky-700 to-indigo-900', 'bg-gradient-to-br from-blue-800 to-sky-700', 'bg-gradient-to-br from-indigo-800 to-blue-900'],
    whatsnew: 'Liquid Glass address bar and tab strip. Enhanced Reader Mode. New AI-powered Highlights.',
    tags: ['Browser', 'Web', 'Tabs', 'Privacy', 'iCloud Tabs'],
  },
  {
    id: 'messages', name: 'Messages', developer: 'Apple Inc.', category: 'Social Networking',
    rating: 4.9, reviews: '1.2M', size: '22.6 MB', version: '21.0', price: 'Free',
    preinstalled: true, featured: true, new: false, appleArcade: false,
    icon: '💬',
    iconBg: 'from-green-500 to-emerald-400',
    description: 'Send unlimited messages to anyone. Messages works with both iMessage and SMS. Features include Tapbacks, inline replies, message effects, animated stickers, SharePlay, and much more.',
    screenshots: ['bg-gradient-to-br from-emerald-800 to-green-900', 'bg-gradient-to-br from-green-700 to-teal-800', 'bg-gradient-to-br from-teal-800 to-emerald-900'],
    whatsnew: 'RCS support for Android users. AI-generated Smart Replies. New typing animation bubbles.',
    tags: ['iMessage', 'SMS', 'RCS', 'FaceTime', 'Stickers'],
  },
  {
    id: 'mail', name: 'Mail', developer: 'Apple Inc.', category: 'Productivity',
    rating: 4.5, reviews: '214K', size: '31.8 MB', version: '18.0', price: 'Free',
    preinstalled: true, featured: false, new: false, appleArcade: false,
    icon: '✉️',
    iconBg: 'from-sky-600 to-blue-500',
    description: 'Mail makes it easy to manage your email. New email categorization automatically sorts your inbox into Primary, Transactions, Updates, and Promotions. AI-powered Summaries give you the gist of long emails.',
    screenshots: ['bg-gradient-to-br from-sky-800 to-blue-900', 'bg-gradient-to-br from-blue-700 to-sky-800', 'bg-gradient-to-br from-sky-700 to-indigo-800'],
    whatsnew: 'AI email summaries, Smart Compose suggestions, improved spam filtering.',
    tags: ['Email', 'Gmail', 'iCloud Mail', 'IMAP', 'Productivity'],
  },
  {
    id: 'facetime', name: 'FaceTime', developer: 'Apple Inc.', category: 'Social Networking',
    rating: 4.8, reviews: '876K', size: '45.2 MB', version: '18.0', price: 'Free',
    preinstalled: true, featured: false, new: false, appleArcade: false,
    icon: '📹',
    iconBg: 'from-green-600 to-emerald-500',
    description: 'FaceTime is the best way to connect with the people you care about. Enjoy crystal-clear HD video calls, SharePlay for watching movies together, and real-time reactions.',
    screenshots: ['bg-gradient-to-br from-emerald-900 to-green-800', 'bg-gradient-to-br from-green-800 to-teal-900', 'bg-gradient-to-br from-teal-900 to-emerald-800'],
    whatsnew: 'Spatial video calls for Apple Vision Pro. Eye contact correction. Background blur AI.',
    tags: ['Video Call', 'Audio Call', 'SharePlay', 'Group FaceTime'],
  },
  {
    id: 'notes', name: 'Notes', developer: 'Apple Inc.', category: 'Productivity',
    rating: 4.8, reviews: '523K', size: '14.7 MB', version: '18.2', price: 'Free',
    preinstalled: true, featured: false, new: false, appleArcade: false,
    icon: '📝',
    iconBg: 'from-yellow-400 to-amber-400',
    description: 'Notes is the best place to capture quick thoughts or save longer notes with checklists, images, web links, and handwritten text. Smart Folders automatically organize your notes.',
    screenshots: ['bg-gradient-to-br from-amber-700 to-yellow-800', 'bg-gradient-to-br from-yellow-700 to-amber-900', 'bg-gradient-to-br from-amber-800 to-orange-900'],
    whatsnew: 'Apple Intelligence writing tools. Math notes that can calculate expressions. Collapsible sections.',
    tags: ['Notes', 'Checklists', 'Drawing', 'iCloud Sync', 'Markdown'],
  },
  {
    id: 'music', name: 'Music', developer: 'Apple Inc.', category: 'Music',
    rating: 4.7, reviews: '918K', size: '54.0 MB', version: '1.5', price: 'Free',
    preinstalled: true, featured: true, new: false, appleArcade: false,
    icon: '🎵',
    iconBg: 'from-rose-600 to-pink-500',
    description: 'Apple Music gives you access to over 100 million songs, curated playlists, and live radio stations. Spatial Audio with Dolby Atmos makes music feel like you\'re right there in the studio.',
    screenshots: ['bg-gradient-to-br from-rose-900 to-pink-800', 'bg-gradient-to-br from-pink-800 to-rose-900', 'bg-gradient-to-br from-rose-800 to-red-900'],
    whatsnew: 'New Autoplaying live lyrics UI. Collaborate on playlists. Spatial Audio for new releases.',
    tags: ['Apple Music', 'Streaming', 'Playlists', 'Spatial Audio', 'Radio'],
  },
  {
    id: 'photos', name: 'Photos', developer: 'Apple Inc.', category: 'Photography',
    rating: 4.6, reviews: '341K', size: '62.3 MB', version: '9.0', price: 'Free',
    preinstalled: true, featured: false, new: false, appleArcade: false,
    icon: '🖼️',
    iconBg: 'from-violet-500 to-purple-600',
    description: 'Photos makes it easy to keep your growing library organized and accessible. Powerful editing tools let you enhance any photo or video. iCloud Photos keeps your entire library up to date across all your devices.',
    screenshots: ['bg-gradient-to-br from-violet-800 to-purple-900', 'bg-gradient-to-br from-purple-700 to-violet-800', 'bg-gradient-to-br from-indigo-800 to-violet-900'],
    whatsnew: 'Memory Movies created with AI. Clean Up tool removes unwanted objects. New editing gestures.',
    tags: ['iCloud Photos', 'Editing', 'Albums', 'Memories', 'RAW'],
  },
  {
    id: 'chess', name: 'Chess', developer: 'Apple Inc.', category: 'Games',
    rating: 4.6, reviews: '87K', size: '8.5 MB', version: '3.16', price: 'Free',
    preinstalled: true, featured: false, new: false, appleArcade: false,
    icon: '♟️',
    iconBg: 'from-slate-600 to-slate-800',
    description: 'Chess is a classic board game for two players. Play against the built-in AI at multiple difficulty levels, or play against a friend locally. Features 3D piece sets and authentic move sounds.',
    screenshots: ['bg-gradient-to-br from-slate-700 to-slate-900', 'bg-gradient-to-br from-slate-800 to-zinc-900', 'bg-gradient-to-br from-zinc-700 to-slate-800'],
    whatsnew: 'New Minimax AI with Alpha-Beta pruning. Piece-Square Table evaluation. 3D board animations.',
    tags: ['Chess', 'Board Game', 'AI', 'Strategy', 'Two Player'],
  },

  // ── Third Party Apps ────────────────────────────────────────────────
  {
    id: 'vscode', name: 'Visual Studio Code', developer: 'Microsoft', category: 'Developer Tools',
    rating: 4.9, reviews: '2.1M', size: '198.4 MB', version: '1.92.0', price: 'Free',
    preinstalled: false, featured: true, new: false, appleArcade: false,
    icon: '💠',
    iconBg: 'from-blue-600 to-indigo-600',
    description: 'VS Code is a lightweight but powerful source code editor. It runs on your desktop and is available for macOS, Windows and Linux. Built with features like IntelliSense, debugging, and Git integration.',
    screenshots: ['bg-gradient-to-br from-blue-900 to-indigo-900', 'bg-gradient-to-br from-indigo-800 to-blue-900', 'bg-gradient-to-br from-blue-800 to-slate-900'],
    whatsnew: 'GitHub Copilot integration. New inline chat. Improved Python and TypeScript support.',
    tags: ['Code Editor', 'Programming', 'Extensions', 'Git', 'TypeScript'],
  },
  {
    id: 'notion', name: 'Notion', developer: 'Notion Labs', category: 'Productivity',
    rating: 4.7, reviews: '445K', size: '82.1 MB', version: '3.12', price: 'Free',
    preinstalled: false, featured: false, new: true, appleArcade: false,
    icon: '📋',
    iconBg: 'from-slate-700 to-slate-900',
    description: 'Notion is the all-in-one workspace that combines notes, docs, wikis, projects, and databases. AI-powered writing assistant helps you draft, summarize, and translate content.',
    screenshots: ['bg-gradient-to-br from-slate-800 to-slate-900', 'bg-gradient-to-br from-zinc-800 to-slate-900', 'bg-gradient-to-br from-slate-700 to-zinc-800'],
    whatsnew: 'Notion AI now generates entire pages. Calendar integration. New Database relationships.',
    tags: ['Notes', 'Docs', 'Wiki', 'Project Management', 'Database'],
  },
  {
    id: 'slack', name: 'Slack', developer: 'Salesforce', category: 'Business',
    rating: 4.6, reviews: '218K', size: '74.3 MB', version: '4.40.0', price: 'Free',
    preinstalled: false, featured: false, new: false, appleArcade: false,
    icon: '🟪',
    iconBg: 'from-purple-600 to-violet-700',
    description: 'Slack is where your team communicates. It\'s where conversations happen, decisions are made, and information is always at your fingertips. Connect with apps you already use.',
    screenshots: ['bg-gradient-to-br from-purple-800 to-violet-900', 'bg-gradient-to-br from-violet-800 to-purple-900', 'bg-gradient-to-br from-purple-900 to-indigo-900'],
    whatsnew: 'AI-generated channel summaries. Huddles with video. Lists for project tracking.',
    tags: ['Team Chat', 'Messaging', 'Channels', 'Video', 'Integrations'],
  },
  {
    id: 'figma', name: 'Figma', developer: 'Figma Inc.', category: 'Graphics & Design',
    rating: 4.9, reviews: '312K', size: '95.6 MB', version: '117.4', price: 'Free',
    preinstalled: false, featured: true, new: false, appleArcade: false,
    icon: '🎨',
    iconBg: 'from-orange-500 to-pink-600',
    description: 'Figma is the world\'s most powerful design tool. Collaborate in real-time, build design systems, prototype interactions, and ship faster with powerful Dev Mode for developers.',
    screenshots: ['bg-gradient-to-br from-orange-900 to-pink-900', 'bg-gradient-to-br from-pink-800 to-orange-900', 'bg-gradient-to-br from-rose-800 to-pink-900'],
    whatsnew: 'AI-powered design generation. Variables with modes. New prototyping interactions.',
    tags: ['Design', 'Prototyping', 'UI/UX', 'Collaboration', 'Vector'],
  },
  {
    id: 'spotify', name: 'Spotify', developer: 'Spotify AB', category: 'Music',
    rating: 4.5, reviews: '1.8M', size: '120.4 MB', version: '1.2.40', price: 'Free',
    preinstalled: false, featured: false, new: false, appleArcade: false,
    icon: '🟢',
    iconBg: 'from-emerald-500 to-green-600',
    description: 'With Spotify, you have access to a world of music and podcasts. You can listen to artists and albums, or create your own playlist of your favourite songs. Want to discover new music? Choose a ready-made playlist.',
    screenshots: ['bg-gradient-to-br from-emerald-900 to-green-900', 'bg-gradient-to-br from-green-800 to-emerald-900', 'bg-gradient-to-br from-teal-800 to-green-900'],
    whatsnew: 'Daylist — a playlist that changes throughout the day. Enhanced podcast recommendations.',
    tags: ['Music', 'Podcasts', 'Playlists', 'Streaming', 'Radio'],
  },
  {
    id: 'zoom', name: 'Zoom', developer: 'Zoom Video Communications', category: 'Business',
    rating: 4.4, reviews: '567K', size: '88.7 MB', version: '6.2.6', price: 'Free',
    preinstalled: false, featured: false, new: false, appleArcade: false,
    icon: '🔵',
    iconBg: 'from-blue-500 to-sky-600',
    description: 'Zoom is the leader in modern enterprise video communications, with an easy, reliable cloud platform for video and audio conferencing, chat, and webinars.',
    screenshots: ['bg-gradient-to-br from-blue-800 to-sky-900', 'bg-gradient-to-br from-sky-800 to-blue-900', 'bg-gradient-to-br from-blue-900 to-indigo-900'],
    whatsnew: 'AI Companion for meeting summaries. New Zoom Docs workspace. Background blur improvements.',
    tags: ['Video Calls', 'Webinars', 'Screen Share', 'Meetings', 'Chat'],
  },

  // ── Apple Arcade ─────────────────────────────────────────────────────
  {
    id: 'arcade-pong', name: 'Liquid Glass Pong', developer: 'Apple Arcade', category: 'Games',
    rating: 4.9, reviews: '234K', size: '42.1 MB', version: '2.1', price: 'Arcade',
    preinstalled: true, featured: false, new: true, appleArcade: true,
    icon: '🎮',
    iconBg: 'from-cyan-500 to-sky-600',
    description: 'Experience classic Pong reimagined with stunning Liquid Glass graphics, real-time physics, and immersive 3D sound. Challenge the AI or play local multiplayer.',
    screenshots: ['bg-gradient-to-br from-cyan-800 to-sky-900', 'bg-gradient-to-br from-sky-700 to-cyan-800', 'bg-gradient-to-br from-cyan-900 to-blue-900'],
    whatsnew: 'New Liquid Glass paddle effects. Haptic feedback. Global leaderboard integration.',
    tags: ['Arcade', 'Pong', 'Multiplayer', 'Retro', 'Leaderboards'],
  },
];

const CATEGORIES = [
  'All', 'Featured', 'New', 'Apple Arcade',
  'Productivity', 'Developer Tools', 'Games', 'Music',
  'Social Networking', 'Business', 'Graphics & Design',
  'Photography', 'Utilities'
];

// ─── Star Rating Component ────────────────────────────────────────────────────
const Stars = ({ rating, size = 11 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5" style={{ fontSize: size }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= full ? 'text-amber-400' : i === full + 1 && half ? 'text-amber-300' : 'text-white/20'}>★</span>
      ))}
    </span>
  );
};

// ─── App Icon Component ───────────────────────────────────────────────────────
const AppIcon = ({ app, size = 'md' }) => {
  const sz = size === 'lg' ? 'w-24 h-24 text-5xl rounded-[22px]' : size === 'sm' ? 'w-10 h-10 text-xl rounded-xl' : 'w-14 h-14 text-3xl rounded-2xl';
  return (
    <div className={`${sz} bg-gradient-to-tr ${app.iconBg} flex items-center justify-center shadow-lg border border-white/10 flex-shrink-0`}>
      {app.icon}
    </div>
  );
};

// ─── App Detail View ──────────────────────────────────────────────────────────
const AppDetail = ({ app, onBack, installed, onInstall }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="flex flex-col h-full overflow-auto text-sm bg-[#1C1C1E]">
      {/* Back Nav */}
      <div className="sticky top-0 z-10 bg-[#1C1C1E]/90 backdrop-blur-xl border-b border-white/8 px-5 py-2 flex items-center gap-2">
        <button onClick={onBack} className="flex items-center gap-1 text-[#007AFF] text-xs font-medium hover:underline">
          <ChevronLeft size={15} /> App Store
        </button>
      </div>

      <div className="flex-1 px-6 py-5 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-5">
          <AppIcon app={app} size="lg" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <h1 className="text-lg font-bold text-white leading-tight">{app.name}</h1>
            <p className="text-xs text-[#007AFF]">{app.developer}</p>
            <div className="flex items-center gap-2">
              <Stars rating={app.rating} />
              <span className="text-[10px] text-white/50">{app.reviews} Ratings</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <button
                onClick={() => onInstall(app)}
                className={`px-6 py-1.5 rounded-full text-xs font-bold shadow transition-all active:scale-95 ${
                  installed 
                    ? 'bg-white/15 text-[#007AFF] hover:bg-white/25' 
                    : app.price === 'Arcade' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                      : 'bg-[#007AFF] text-white hover:bg-blue-500'
                }`}
              >
                {installed ? 'OPEN' : app.price === 'Arcade' ? 'PLAY' : app.price === 'Free' ? 'GET' : app.price}
              </button>
              {installed && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <CheckCircle2 size={11} /> Installed
                </span>
              )}
              {app.appleArcade && (
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-[10px] font-bold text-white">
                  Apple Arcade
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Rating', value: app.rating.toFixed(1), sub: 'out of 5', icon: Star },
            { label: 'Reviews', value: app.reviews, sub: 'ratings', icon: Users },
            { label: 'Size', value: app.size, sub: 'MB', icon: Download },
            { label: 'Version', value: app.version, sub: 'latest', icon: RefreshCw },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl bg-white/5 border border-white/8 text-center space-y-0.5">
              <div className="text-[10px] text-white/40 uppercase tracking-wide font-medium">{s.label}</div>
              <div className="text-sm font-bold text-white">{s.value}</div>
              <div className="text-[9px] text-white/40">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
          {['overview', "what's new", 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-white/15 text-white shadow' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Screenshots */}
            <div>
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wide mb-3">Screenshots</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {app.screenshots.map((sc, i) => (
                  <div key={i} className={`w-48 h-28 rounded-xl ${sc} flex-shrink-0 border border-white/10 shadow-lg flex items-center justify-center`}>
                    <span className="text-white/20 text-xs font-mono">Screenshot {i+1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-xs text-white/75 leading-relaxed">{app.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {app.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/8 border border-white/10 text-[11px] text-white/60 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === "what's new" && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-2">
            <div className="flex items-center gap-2 text-white/50 text-[10px] font-medium">
              <Clock size={11} /> Version {app.version} · Updated recently
            </div>
            <p className="text-xs text-white/80 leading-relaxed">{app.whatsnew}</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-black text-white">{app.rating.toFixed(1)}</div>
                <Stars rating={app.rating} size={14} />
                <div className="text-[10px] text-white/40 mt-1">{app.reviews} Ratings</div>
              </div>
              <div className="flex-1 space-y-1">
                {[5,4,3,2,1].map(n => {
                  const w = n === 5 ? 75 : n === 4 ? 15 : n === 3 ? 5 : n === 2 ? 3 : 2;
                  return (
                    <div key={n} className="flex items-center gap-2 text-[10px] text-white/40">
                      <span className="w-2">{n}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${w}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sample Reviews */}
            {[
              { name: 'Alex J.', rating: 5, date: 'Jul 2026', text: 'Absolutely love this app! Works flawlessly on macOS 26 Tahoe.' },
              { name: 'Sam O.', rating: 5, date: 'Jun 2026', text: 'Best in class. The new Liquid Glass UI is stunning.' },
              { name: 'Maya C.', rating: 4, date: 'Jun 2026', text: 'Great app overall. A few minor bugs but very usable.' },
            ].map((r, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/8 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-white">{r.name}</span>
                  <span className="text-[10px] text-white/40">{r.date}</span>
                </div>
                <Stars rating={r.rating} />
                <p className="text-[11px] text-white/70">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── App Row Item ─────────────────────────────────────────────────────────────
const AppRow = ({ app, installed, onInstall, onView }) => (
  <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0 group">
    <div className="cursor-pointer" onClick={() => onView(app)}>
      <AppIcon app={app} size="sm" />
    </div>
    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onView(app)}>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-xs text-white group-hover:text-[#007AFF] truncate">{app.name}</span>
        {app.appleArcade && <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold">ARCADE</span>}
        {app.new && <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">NEW</span>}
      </div>
      <p className="text-[10px] text-white/40 truncate">{app.category}</p>
      <Stars rating={app.rating} />
    </div>
    <button
      onClick={() => onInstall(app)}
      className={`px-4 py-1 rounded-full text-[11px] font-bold flex-shrink-0 transition-all active:scale-95 ${
        installed 
          ? 'bg-white/10 text-[#007AFF] hover:bg-white/20' 
          : app.price === 'Arcade'
            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
            : 'bg-[#007AFF]/20 text-[#007AFF] hover:bg-[#007AFF] hover:text-white'
      }`}
    >
      {installed ? 'OPEN' : app.price === 'Arcade' ? 'PLAY' : app.price === 'Free' ? 'GET' : app.price}
    </button>
  </div>
);

// ─── Featured Card ────────────────────────────────────────────────────────────
const FeaturedCard = ({ app, installed, onInstall, onView }) => (
  <div 
    className={`relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-white/10 shadow-xl bg-gradient-to-tr ${app.iconBg} hover:scale-[1.01] transition-transform`}
    onClick={() => onView(app)}
  >
    <div className="absolute inset-0 bg-black/40" />
    <div className="absolute inset-0 flex flex-col justify-between p-5">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Editor's Choice</span>
          <h3 className="text-xl font-black text-white leading-tight">{app.name}</h3>
          <p className="text-xs text-white/70">{app.developer}</p>
        </div>
        <AppIcon app={app} size="sm" />
      </div>
      <div className="flex items-end justify-between">
        <p className="text-xs text-white/60 max-w-xs leading-relaxed line-clamp-2">{app.description.slice(0, 80)}...</p>
        <button
          onClick={e => { e.stopPropagation(); onInstall(app); }}
          className={`px-5 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all active:scale-95 ${
            installed ? 'bg-white/20 text-white' : 'bg-white text-slate-900'
          }`}
        >
          {installed ? 'OPEN' : 'GET'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main App Store ───────────────────────────────────────────────────────────
export const ValAppStore = () => {
  const { openApp, addNotification } = useOS();
  const [installedIds, setInstalledIds] = useState(() => 
    APP_CATALOG.filter(a => a.preinstalled).map(a => a.id)
  );
  const [installingId, setInstallingId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover'); // discover | arcade | search | updates

  const handleInstall = (app) => {
    sounds.playClick();
    if (installedIds.includes(app.id)) {
      // Open pre-installed system apps
      const sysIds = ['finder','safari','messages','mail','facetime','notes','music','photos','chess','arcade','arcade-pong','code'];
      if (sysIds.includes(app.id)) {
        const mapId = app.id === 'arcade-pong' ? 'arcade' : app.id;
        openApp(mapId);
      }
      return;
    }
    // Simulate install progress
    setInstallingId(app.id);
    setTimeout(() => {
      setInstalledIds(prev => [...prev, app.id]);
      setInstallingId(null);
      addNotification('App Store', `"${app.name}" has been installed.`);
    }, 1800);
  };

  const filteredApps = useMemo(() => {
    let apps = APP_CATALOG;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return apps.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.developer.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeCategory === 'Featured') return apps.filter(a => a.featured);
    if (activeCategory === 'New') return apps.filter(a => a.new);
    if (activeCategory === 'Apple Arcade') return apps.filter(a => a.appleArcade);
    if (activeCategory !== 'All') return apps.filter(a => a.category === activeCategory);
    return apps;
  }, [searchQuery, activeCategory]);

  const featuredApps = APP_CATALOG.filter(a => a.featured);

  // App Detail View
  if (selectedApp) {
    return (
      <AppDetail
        app={selectedApp}
        onBack={() => setSelectedApp(null)}
        installed={installedIds.includes(selectedApp.id)}
        onInstall={handleInstall}
      />
    );
  }

  return (
    <div className="flex h-full w-full bg-[#1C1C1E] text-white select-none font-sans overflow-hidden">
      {/* Left Sidebar Nav */}
      <div className="w-44 border-r border-white/8 flex flex-col bg-[#252528]/80 backdrop-blur-md">
        {/* Search */}
        <div className="p-3 border-b border-white/8">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-2.5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); if (e.target.value) setActiveTab('search'); else setActiveTab('discover'); }}
              placeholder="Search..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#007AFF]"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setActiveTab('discover'); }} className="absolute right-2 top-2 text-white/40 hover:text-white">
                <X size={11} />
              </button>
            )}
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="p-2 space-y-0.5 border-b border-white/8">
          {[
            { id: 'discover', label: 'Discover', icon: Sparkles },
            { id: 'arcade', label: 'Arcade', icon: Award },
            { id: 'updates', label: 'Updates', icon: RefreshCw },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(''); setActiveCategory('All'); }}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id ? 'bg-[#007AFF] text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'
              }`}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="flex-1 p-2 overflow-y-auto space-y-0.5">
          <div className="px-2 py-1 text-[10px] font-bold text-white/30 uppercase tracking-wider">Categories</div>
          {CATEGORIES.filter(c => !['All','Featured','New','Apple Arcade'].includes(c)).map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActiveTab('discover'); setSearchQuery(''); }}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === cat ? 'bg-[#007AFF] text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="h-10 px-5 flex items-center justify-between border-b border-white/8 bg-white/3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">
              {activeTab === 'discover' ? 'Discover' : activeTab === 'arcade' ? 'Apple Arcade' : activeTab === 'updates' ? 'Updates' : `Results for "${searchQuery}"`}
            </span>
            {activeCategory !== 'All' && activeTab === 'discover' && (
              <span className="px-2 py-0.5 rounded-full bg-[#007AFF]/20 text-[#007AFF] text-[10px] font-bold">{activeCategory}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/40">
            <Shield size={11} className="text-emerald-400" />
            <span>Apple Verified Apps</span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-auto p-5 space-y-6">

          {/* Discover Tab */}
          {activeTab === 'discover' && activeCategory === 'All' && !searchQuery && (
            <>
              {/* Featured Carousel */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-white/60 uppercase tracking-wide">Editor's Choice</h2>
                <div className="grid grid-cols-1 gap-3">
                  {featuredApps.slice(0, 2).map(app => (
                    <FeaturedCard
                      key={app.id}
                      app={app}
                      installed={installedIds.includes(app.id)}
                      onInstall={handleInstall}
                      onView={setSelectedApp}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Categories */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-white/60 uppercase tracking-wide">Browse by Category</h2>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { cat: 'Productivity', icon: '⚡', color: 'from-blue-600/30 to-indigo-600/30' },
                    { cat: 'Developer Tools', icon: '🛠️', color: 'from-slate-600/30 to-slate-800/30' },
                    { cat: 'Games', icon: '🎮', color: 'from-purple-600/30 to-indigo-600/30' },
                    { cat: 'Music', icon: '🎵', color: 'from-rose-600/30 to-pink-600/30' },
                    { cat: 'Graphics & Design', icon: '🎨', color: 'from-orange-600/30 to-rose-600/30' },
                    { cat: 'Business', icon: '💼', color: 'from-emerald-600/30 to-teal-600/30' },
                  ].map(({ cat, icon, color }) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`p-3 rounded-xl bg-gradient-to-tr ${color} border border-white/10 flex flex-col items-center gap-1.5 hover:border-white/25 transition-all group`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="text-[10px] font-bold text-white/70 group-hover:text-white text-center leading-tight">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Now */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-white/60 uppercase tracking-wide">Popular Now</h2>
                  <button onClick={() => setActiveCategory('All')} className="text-[10px] text-[#007AFF] hover:underline">See All</button>
                </div>
                <div className="divide-y divide-white/5">
                  {APP_CATALOG.slice(0, 6).map(app => (
                    <AppRow
                      key={app.id}
                      app={app}
                      installed={installedIds.includes(app.id)}
                      onInstall={handleInstall}
                      onView={setSelectedApp}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Category / Search Results */}
          {(activeCategory !== 'All' || searchQuery || activeTab === 'discover') && (activeCategory !== 'All' || searchQuery) && (
            <div className="space-y-2">
              <div className="text-xs text-white/40 font-medium">{filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''}</div>
              <div className="divide-y divide-white/5">
                {filteredApps.map(app => (
                  <AppRow
                    key={app.id}
                    app={app}
                    installed={installedIds.includes(app.id)}
                    onInstall={handleInstall}
                    onView={setSelectedApp}
                  />
                ))}
                {filteredApps.length === 0 && (
                  <div className="py-16 flex flex-col items-center gap-3 text-white/30">
                    <Search size={36} strokeWidth={1} />
                    <div className="text-sm font-bold">No apps found</div>
                    <div className="text-xs">Try a different search or category</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Apple Arcade Tab */}
          {activeTab === 'arcade' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-pink-600/20 border border-purple-400/20 flex items-center gap-4">
                <div className="text-4xl">🕹️</div>
                <div>
                  <h2 className="font-black text-white text-sm">Apple Arcade</h2>
                  <p className="text-xs text-white/60">Unlimited access to 200+ games. No ads. No in-app purchases.</p>
                  <div className="mt-2 text-[10px] text-purple-300 font-bold">$4.99/month · Free with Apple One</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-wide">Arcade Games</h3>
                <div className="divide-y divide-white/5">
                  {APP_CATALOG.filter(a => a.appleArcade).map(app => (
                    <AppRow
                      key={app.id}
                      app={app}
                      installed={installedIds.includes(app.id)}
                      onInstall={handleInstall}
                      onView={setSelectedApp}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Updates Tab */}
          {activeTab === 'updates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Available Updates</h2>
                <button 
                  onClick={() => {
                    sounds.playClick();
                    addNotification('App Store', 'All apps updated to the latest version.');
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#007AFF]/20 text-[#007AFF] text-xs font-bold hover:bg-[#007AFF] hover:text-white transition-all"
                >
                  Update All
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {APP_CATALOG.filter(a => installedIds.includes(a.id)).map(app => (
                  <div key={app.id} className="flex items-center gap-3 py-3">
                    <AppIcon app={app} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-white">{app.name}</div>
                      <div className="text-[10px] text-white/40">Version {app.version} · {app.size}</div>
                      <div className="text-[10px] text-white/50 mt-0.5 truncate">{app.whatsnew.slice(0, 60)}...</div>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        addNotification('App Store', `"${app.name}" updated to v${app.version}.`);
                      }}
                      className="px-4 py-1 rounded-full bg-[#007AFF]/15 text-[#007AFF] text-[11px] font-bold hover:bg-[#007AFF] hover:text-white transition-all flex-shrink-0"
                    >
                      UPDATE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Installing overlay indicator */}
          {installingId && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl z-50 text-xs text-white font-semibold">
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Installing {APP_CATALOG.find(a => a.id === installingId)?.name}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
