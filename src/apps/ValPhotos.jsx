import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import { 
  Search, Grid, List, Heart, Share2, Download, 
  ZoomIn, X, ChevronLeft, ChevronRight, 
  Image as ImageIcon, Clock, Sliders, Star, Info
} from 'lucide-react';

const PHOTOS = [
  { id: 'p1', name: 'Mountain Peaks', date: 'Jul 2026', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85', tags: ['Nature', 'Mountains'] },
  { id: 'p2', name: 'Tropical Beach', date: 'Jun 2026', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85', tags: ['Beach', 'Ocean'] },
  { id: 'p3', name: 'Aurora Borealis', date: 'Jan 2026', url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=85', tags: ['Nature', 'Night'] },
  { id: 'p4', name: 'Yosemite Falls', date: 'May 2026', url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=85', tags: ['Nature', 'Waterfall'] },
  { id: 'p5', name: 'Lake Tahoe', date: 'Jul 2026', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=85', tags: ['Lake', 'Nature'] },
  { id: 'p6', name: 'Sequoia Forest', date: 'Apr 2026', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=85', tags: ['Forest', 'Trees'] },
  { id: 'p7', name: 'Desert Dunes', date: 'Mar 2026', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=85', tags: ['Desert', 'Sunset'] },
  { id: 'p8', name: 'Starry Night', date: 'Feb 2026', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=800&q=85', tags: ['Night', 'Stars'] },
  { id: 'p9', name: 'Alpine Meadow', date: 'Jun 2026', url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=85', tags: ['Nature', 'Flowers'] },
  { id: 'p10', name: 'Ocean Waves', date: 'May 2026', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=85', tags: ['Ocean', 'Waves'] },
  { id: 'p11', name: 'Canyon Sunrise', date: 'Apr 2026', url: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=85', tags: ['Canyon', 'Sunrise'] },
  { id: 'p12', name: 'Misty Mountains', date: 'Mar 2026', url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=85', tags: ['Mountains', 'Mist'] },
];

const ALBUMS = [
  { id: 'a1', name: 'Favorites', count: 8, cover: PHOTOS[0].url },
  { id: 'a2', name: 'Nature', count: 12, cover: PHOTOS[2].url },
  { id: 'a3', name: 'Travel', count: 5, cover: PHOTOS[1].url },
  { id: 'a4', name: 'Screenshots', count: 24, cover: PHOTOS[4].url },
];

export const ValPhotos = () => {
  const { setWallpaper, addNotification } = useOS();
  const [activeView, setActiveView] = useState('library'); // library | albums | memories
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [selectedId, setSelectedId] = useState(null);
  const [lightboxId, setLightboxId] = useState(null);
  const [liked, setLiked] = useState(['p1', 'p3']);
  const [searchQ, setSearchQ] = useState('');
  const [filter, setFilter] = useState('none');

  const lightboxPhoto = PHOTOS.find(p => p.id === lightboxId);
  const lightboxIdx = PHOTOS.findIndex(p => p.id === lightboxId);

  const filteredPhotos = PHOTOS.filter(p =>
    p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQ.toLowerCase()))
  );

  const getFilter = () => ({
    none: 'none',
    bw: 'grayscale(100%)',
    sepia: 'sepia(80%)',
    vivid: 'saturate(180%) contrast(110%)',
    cool: 'hue-rotate(20deg) saturate(120%)',
  }[filter]);

  return (
    <div className="flex h-full w-full bg-[#1C1C1E] text-white select-none font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/8 flex flex-col bg-[#252528]/90">
        <div className="p-3 space-y-0.5 border-b border-white/8">
          {[
            { id: 'library', label: 'Library', icon: ImageIcon },
            { id: 'albums', label: 'Albums', icon: Grid },
            { id: 'memories', label: 'Memories', icon: Clock },
          ].map(v => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeView === v.id ? 'bg-[#007AFF]/20 text-[#007AFF]' : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              <v.icon size={13} /> {v.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Albums</div>
          {ALBUMS.map(al => (
            <button key={al.id} onClick={() => setActiveView('albums')} className="w-full flex items-center gap-2 text-left hover:bg-white/5 p-1.5 rounded-lg group">
              <img src={al.cover} alt={al.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-white/80 group-hover:text-white truncate">{al.name}</div>
                <div className="text-[10px] text-white/30">{al.count} photos</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-2.5 border-b border-white/8 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={12} className="absolute left-2.5 top-2 text-white/40" />
            <input
              type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search photos..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#007AFF]"
            />
          </div>
          
          {/* Filter pills */}
          <div className="flex gap-1">
            {[['none','Original'],['bw','B&W'],['sepia','Sepia'],['vivid','Vivid'],['cool','Cool']].map(([f, l]) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                  filter === f ? 'bg-[#007AFF] text-white' : 'bg-white/8 text-white/50 hover:bg-white/15'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border border-white/10 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-white/40'}`}><Grid size={13} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-white/15 text-white' : 'text-white/40'}`}><List size={13} /></button>
          </div>
          <span className="text-[11px] text-white/30">{filteredPhotos.length} Photos</span>
        </div>

        {/* Photo grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-2">
              {filteredPhotos.map(photo => (
                <div
                  key={photo.id}
                  className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedId === photo.id ? 'border-[#007AFF] ring-2 ring-[#007AFF]/40' : 'border-transparent hover:border-white/30'
                  }`}
                  onClick={() => setSelectedId(photo.id === selectedId ? null : photo.id)}
                  onDoubleClick={() => setLightboxId(photo.id)}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    style={{ filter: getFilter() }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-start justify-end p-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={e => { e.stopPropagation(); setLiked(l => l.includes(photo.id) ? l.filter(x => x !== photo.id) : [...l, photo.id]); }}
                      className="p-1.5 bg-black/40 rounded-full backdrop-blur-sm"
                    >
                      <Heart size={12} fill={liked.includes(photo.id) ? '#f43f5e' : 'none'} className={liked.includes(photo.id) ? 'text-rose-400' : 'text-white'} />
                    </button>
                  </div>
                  {/* Label */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-[10px] text-white font-semibold truncate">{photo.name}</div>
                    <div className="text-[9px] text-white/50">{photo.date}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredPhotos.map(photo => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedId(photo.id === selectedId ? null : photo.id)}
                  onDoubleClick={() => setLightboxId(photo.id)}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer border transition-all ${
                    selectedId === photo.id ? 'bg-[#007AFF]/15 border-[#007AFF]/30' : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <img src={photo.url} alt={photo.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" style={{ filter: getFilter() }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white">{photo.name}</div>
                    <div className="text-[10px] text-white/40">{photo.date} · {photo.tags.join(', ')}</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setWallpaper({ id: photo.id, name: photo.name, type: 'image', url: photo.url }); addNotification('Photos', `Wallpaper set to "${photo.name}"`); }}
                    className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60 hover:bg-[#007AFF] hover:text-white transition-all font-medium"
                  >
                    Set Wallpaper
                  </button>
                  <Heart size={13} fill={liked.includes(photo.id) ? '#f43f5e' : 'none'} className={liked.includes(photo.id) ? 'text-rose-400' : 'text-white/20'} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom info bar when selected */}
        {selectedId && (
          <div className="border-t border-white/8 px-4 py-2.5 flex items-center gap-3 bg-[#252528]/80 backdrop-blur-md">
            {(() => {
              const p = PHOTOS.find(x => x.id === selectedId);
              return p ? (
                <>
                  <img src={p.url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" style={{ filter: getFilter() }} />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{p.name}</div>
                    <div className="text-[10px] text-white/40">{p.date} · {p.tags.join(', ')}</div>
                  </div>
                  <button onClick={() => setLightboxId(selectedId)} className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white hover:bg-white/20 flex items-center gap-1.5"><ZoomIn size={12} /> View</button>
                  <button onClick={() => { setWallpaper({ id: p.id, name: p.name, type: 'image', url: p.url }); addNotification('Photos', `Wallpaper set to "${p.name}"`); }} className="px-3 py-1.5 rounded-lg bg-[#007AFF] text-xs text-white hover:bg-blue-500">Set Wallpaper</button>
                </>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxId && lightboxPhoto && (
        <div className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-md flex items-center justify-center" onClick={() => setLightboxId(null)}>
          <div className="relative max-w-5xl max-h-full p-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightboxId(null)} className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full text-white hover:bg-white/20"><X size={16} /></button>
            <button
              onClick={() => setLightboxId(PHOTOS[(lightboxIdx - 1 + PHOTOS.length) % PHOTOS.length].id)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 z-10"
            ><ChevronLeft size={18} /></button>
            <button
              onClick={() => setLightboxId(PHOTOS[(lightboxIdx + 1) % PHOTOS.length].id)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 z-10"
            ><ChevronRight size={18} /></button>
            <img
              src={lightboxPhoto.url.replace('w=800', 'w=1600')}
              alt={lightboxPhoto.name}
              className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl object-contain"
              style={{ filter: getFilter() }}
            />
            <div className="absolute bottom-8 inset-x-0 text-center space-y-1">
              <div className="text-white font-bold text-sm">{lightboxPhoto.name}</div>
              <div className="text-white/50 text-xs">{lightboxPhoto.date}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
