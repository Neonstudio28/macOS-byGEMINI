import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Shuffle, Repeat, Music, Heart, ListMusic, Radio,
  ChevronUp, ChevronDown, Search, Plus
} from 'lucide-react';
import { sounds } from '../utils/soundEngine';

const TRACKS = [
  { 
    id: '1', title: 'Tahoe Synth Dream 26', artist: 'Glass Horizon', album: 'Liquid Nights',
    duration: 225, genre: 'Synthwave', year: 2026,
    art: '/album1.jpg',
    color: 'from-pink-600 to-rose-700'
  },
  { 
    id: '2', title: 'Liquid Sunset Chill', artist: 'Aquatic Dreams', album: 'Lo-Fi Beats Vol. 3',
    duration: 252, genre: 'Lo-Fi', year: 2026,
    art: '/album2.jpg',
    color: 'from-cyan-500 to-indigo-700'
  },
  { 
    id: '3', title: 'Cyber Pines Wave', artist: 'Refractive Shaders', album: 'Digital Forest',
    duration: 178, genre: 'Ambient Electronic', year: 2026,
    art: '/album3.jpg',
    color: 'from-emerald-500 to-teal-700'
  },
  { 
    id: '4', title: 'Neon Ambient Pulse', artist: 'Tahoe Core', album: 'Deep Frequencies',
    duration: 300, genre: 'Ambient', year: 2026,
    art: '/album4.jpg',
    color: 'from-purple-600 to-fuchsia-700'
  },
  {
    id: '5', title: 'Crystal Mountain Echo', artist: 'Alpine Frequencies', album: 'Peaks & Valleys',
    duration: 198, genre: 'Ambient', year: 2026,
    art: '/album1.jpg',
    color: 'from-sky-500 to-blue-700'
  },
  {
    id: '6', title: 'Midnight Glass Rain', artist: 'Glass Horizon', album: 'Liquid Nights',
    duration: 243, genre: 'Synthwave', year: 2026,
    art: '/album4.jpg',
    color: 'from-violet-600 to-purple-800'
  }
];

const PLAYLISTS = [
  { id: 'p1', name: 'Tahoe Favorites', count: 12, color: 'from-pink-500 to-rose-600' },
  { id: 'p2', name: 'Late Night Coding', count: 8, color: 'from-indigo-500 to-purple-600' },
  { id: 'p3', name: 'Morning Focus', count: 6, color: 'from-amber-400 to-orange-500' },
  { id: 'p4', name: 'Apple Music Mix', count: 25, color: 'from-red-500 to-pink-600' },
];

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const ValMusic = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false); // 'off' | 'one' | 'all'
  const [liked, setLiked] = useState([]);
  const [activeView, setActiveView] = useState('library'); // 'library' | 'playlists' | 'radio'
  const [searchQ, setSearchQ] = useState('');
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const track = TRACKS[currentIndex];

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= track.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentIndex]);

  // Spectrum visualizer
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bars = new Array(40).fill(0).map(() => ({ val: Math.random() * 20 + 5, target: 0 }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bw = canvas.width / bars.length;
      bars.forEach((bar, i) => {
        if (isPlaying) {
          bar.target = Math.random() * canvas.height * 0.85 + 8;
        } else {
          bar.target = Math.sin(i * 0.4 + Date.now() * 0.001) * 6 + 10;
        }
        bar.val += (bar.target - bar.val) * 0.2;
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, 'rgba(236,72,153,0.9)');
        grad.addColorStop(1, 'rgba(6,182,212,0.9)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(i * bw + 2, canvas.height - bar.val, bw - 4, bar.val, 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handleNext = () => {
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * TRACKS.length));
    } else {
      setCurrentIndex(i => (i + 1) % TRACKS.length);
    }
    setProgress(0);
  };

  const handlePrev = () => {
    if (progress > 3) { setProgress(0); return; }
    setCurrentIndex(i => (i - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const togglePlay = () => {
    sounds.playClick();
    setIsPlaying(p => !p);
  };

  const filteredTracks = TRACKS.filter(t =>
    t.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    t.artist.toLowerCase().includes(searchQ.toLowerCase()) ||
    t.album.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="flex h-full w-full bg-[#1C1C1E] text-white select-none font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/8 flex flex-col bg-[#252528]/90 backdrop-blur-md">
        {/* Nav */}
        <div className="p-3 space-y-0.5 border-b border-white/8">
          <div className="text-[11px] font-bold text-white/30 uppercase tracking-widest px-2 py-1">Library</div>
          {[
            { id: 'library', label: 'Songs', icon: Music },
            { id: 'playlists', label: 'Playlists', icon: ListMusic },
            { id: 'radio', label: 'Radio', icon: Radio },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeView === item.id ? 'bg-rose-500/20 text-rose-300' : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Playlists */}
        <div className="flex-1 p-3 overflow-y-auto space-y-0.5">
          <div className="text-[11px] font-bold text-white/30 uppercase tracking-widest px-2 py-1">Playlists</div>
          {PLAYLISTS.map(pl => (
            <button key={pl.id} className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-white/60 hover:bg-white/8 hover:text-white transition-colors group">
              <div className={`w-5 h-5 rounded bg-gradient-to-tr ${pl.color} flex-shrink-0`} />
              <span className="truncate font-medium">{pl.name}</span>
              <span className="ml-auto text-white/30 text-[10px]">{pl.count}</span>
            </button>
          ))}
          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#007AFF] hover:bg-white/8 transition-colors mt-1">
            <Plus size={13} /> New Playlist
          </button>
        </div>

        {/* Volume */}
        <div className="p-3 border-t border-white/8 space-y-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setMuted(m => !m)} className="text-white/50 hover:text-white">
              {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <input
              type="range" min="0" max="100" value={muted ? 0 : volume}
              onChange={e => { setVolume(+e.target.value); setMuted(false); }}
              className="flex-1 accent-rose-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Song list */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search & header */}
          <div className="px-5 py-3 border-b border-white/8 flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-2.5 top-2 text-white/40" />
              <input
                type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search songs, artists, albums..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
              />
            </div>
            <span className="text-[11px] text-white/30">{filteredTracks.length} songs</span>
          </div>

          {/* Track list */}
          <div className="flex-1 overflow-y-auto">
            {/* Column Headers */}
            <div className="sticky top-0 grid grid-cols-[2.5rem_1fr_1fr_4rem] gap-3 px-4 py-2 text-[10px] font-bold text-white/30 uppercase tracking-wider border-b border-white/5 bg-[#1C1C1E]/90 backdrop-blur-sm">
              <div>#</div>
              <div>Title</div>
              <div>Album</div>
              <div className="text-right">Time</div>
            </div>
            {filteredTracks.map((t, i) => {
              const isActive = t.id === track.id;
              const isLiked = liked.includes(t.id);
              return (
                <div
                  key={t.id}
                  onDoubleClick={() => { setCurrentIndex(TRACKS.indexOf(t)); setProgress(0); setIsPlaying(true); sounds.playClick(); }}
                  onClick={() => { setCurrentIndex(TRACKS.indexOf(t)); setProgress(0); }}
                  className={`grid grid-cols-[2.5rem_1fr_1fr_4rem] gap-3 px-4 py-2.5 items-center cursor-pointer group border-b border-white/3 transition-colors ${
                    isActive ? 'bg-rose-500/10 border-rose-500/20' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="text-center">
                    {isActive && isPlaying ? (
                      <div className="flex items-end justify-center gap-0.5 h-4">
                        {[1,2,3].map(b => <div key={b} className="w-0.5 bg-rose-400 animate-bounce rounded-full" style={{ height: `${Math.random()*12+4}px`, animationDelay: `${b*100}ms` }} />)}
                      </div>
                    ) : (
                      <span className={`text-[11px] font-mono ${isActive ? 'text-rose-400' : 'text-white/30 group-hover:hidden'}`}>{i + 1}</span>
                    )}
                    <Play size={11} className="hidden group-hover:block text-white/60 mx-auto" />
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={t.art} alt={t.album} className="w-9 h-9 rounded-lg object-cover shadow-lg flex-shrink-0" />
                    <div className="min-w-0">
                      <div className={`font-semibold text-xs truncate ${isActive ? 'text-rose-300' : 'text-white'}`}>{t.title}</div>
                      <div className="text-[10px] text-white/40 truncate">{t.artist}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-white/40 truncate">{t.album}</div>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={e => { e.stopPropagation(); setLiked(l => l.includes(t.id) ? l.filter(x => x !== t.id) : [...l, t.id]); }}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity ${isLiked ? 'text-rose-400 opacity-100' : 'text-white/30 hover:text-rose-400'}`}
                    >
                      <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                    <span className="text-[10px] text-white/40 font-mono">{formatTime(t.duration)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Now Playing Bar */}
        <div className="flex-shrink-0 border-t border-white/8 bg-[#252528]/90 backdrop-blur-xl px-4 py-3">
          {/* Visualizer */}
          <canvas ref={canvasRef} width={600} height={32} className="w-full rounded-lg mb-2" style={{ height: '32px' }} />

          <div className="flex items-center gap-4">
            {/* Track info */}
            <div className="flex items-center gap-3 w-56 min-w-0">
              <img src={track.art} alt={track.album} className="w-11 h-11 rounded-lg shadow-xl object-cover flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-bold text-xs text-white truncate">{track.title}</div>
                <div className="text-[10px] text-rose-400 truncate">{track.artist}</div>
              </div>
              <button onClick={() => setLiked(l => l.includes(track.id) ? l.filter(x => x !== track.id) : [...l, track.id])} className="flex-shrink-0">
                <Heart size={14} className={liked.includes(track.id) ? 'text-rose-400 fill-rose-400' : 'text-white/30 hover:text-rose-400'} />
              </button>
            </div>

            {/* Center controls */}
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-4">
                <button onClick={() => setShuffle(s => !s)} className={`p-1 rounded transition-colors ${shuffle ? 'text-rose-400' : 'text-white/40 hover:text-white'}`}>
                  <Shuffle size={14} />
                </button>
                <button onClick={handlePrev} className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors">
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying
                    ? <Pause size={16} className="text-[#1C1C1E]" />
                    : <Play size={16} className="text-[#1C1C1E] ml-0.5" />}
                </button>
                <button onClick={handleNext} className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors">
                  <SkipForward size={16} />
                </button>
                <button onClick={() => setRepeat(r => !r)} className={`p-1 rounded transition-colors ${repeat ? 'text-rose-400' : 'text-white/40 hover:text-white'}`}>
                  <Repeat size={14} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2 w-full max-w-sm">
                <span className="text-[9px] text-white/40 font-mono w-7 text-right">{formatTime(progress)}</span>
                <div
                  className="flex-1 h-1 bg-white/15 rounded-full cursor-pointer relative group"
                  onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    setProgress(Math.floor(pct * track.duration));
                  }}
                >
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(progress / track.duration) * 100}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${(progress / track.duration) * 100}% - 6px)` }} />
                </div>
                <span className="text-[9px] text-white/40 font-mono w-7">{formatTime(track.duration)}</span>
              </div>
            </div>

            {/* Right spacer */}
            <div className="w-56" />
          </div>
        </div>
      </div>
    </div>
  );
};
