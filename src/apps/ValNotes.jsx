import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Search, Edit3, Eye, Check, 
  Folder, Pin, Lock, Share2, Sparkles, Clock, Star
} from 'lucide-react';
import { sounds } from '../utils/soundEngine';

const DEFAULT_NOTES = [
  {
    id: 'n1',
    title: 'macOS 26 Tahoe Features',
    content: `# macOS 26 Tahoe Features

- **Liquid Glass Design System**: Optical SVG displacement shaders for window refraction
- **Parabolic Dock Easing**: Smooth scale dynamics with spring physics
- **Spatial Audio Synthesizer**: Web Audio F# Major startup chime
- **Apple Intelligence**: Real-time writing assistant & smart replies
- **System-wide Theme Engine**: Automatic light/dark mode adaptation based on system clock`,
    date: 'Today, 2:30 PM',
    folder: 'Notes',
    pinned: true
  },
  {
    id: 'n2',
    title: 'WWDC 2026 Keynote Plan',
    content: `## Keynote Structure

1. **Intro Video**: Tahoe Sunset flyover in 8K Spatial Video
2. **Design Language**: Introducing Liquid Glass material
3. **Core Apps**: Safari 18, Messages RCS, Notes AI, Music Synth
4. **Developer Tools**: ValCode Studio with integrated JS engine`,
    date: 'Yesterday, 11:15 AM',
    folder: 'Work',
    pinned: true
  },
  {
    id: 'n3',
    title: 'Shopping & Grocery List',
    content: `- Espresso coffee beans (Dark roast)
- Oat milk (Barista blend)
- Fresh avocados
- Sourdough bread
- Organic blueberries`,
    date: 'Jul 21, 2026',
    folder: 'Personal',
    pinned: false
  }
];

export const ValNotes = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('valos_notes_v2');
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  });

  const [activeId, setActiveId] = useState(notes[0]?.id || 'n1');
  const [activeFolder, setActiveFolder] = useState('All'); // All | Notes | Work | Personal
  const [searchQ, setSearchQ] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const activeNote = notes.find(n => n.id === activeId) || notes[0];

  useEffect(() => {
    localStorage.setItem('valos_notes_v2', JSON.stringify(notes));
  }, [notes]);

  const handleCreateNote = () => {
    sounds.playClick();
    const newNote = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '# New Note\n\nStart writing here...',
      date: 'Just now',
      folder: activeFolder === 'All' ? 'Notes' : activeFolder,
      pinned: false
    };
    setNotes([newNote, ...notes]);
    setActiveId(newNote.id);
  };

  const handleDelete = (id, e) => {
    e?.stopPropagation();
    sounds.playClick();
    if (notes.length === 1) return;
    const rest = notes.filter(n => n.id !== id);
    setNotes(rest);
    if (activeId === id) setActiveId(rest[0].id);
  };

  const handleTogglePin = (id, e) => {
    e?.stopPropagation();
    sounds.playClick();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const updateActive = (field, value) => {
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, [field]: value } : n));
  };

  const filtered = notes.filter(n => {
    if (activeFolder !== 'All' && n.folder !== activeFolder) return false;
    if (!searchQ.trim()) return true;
    const q = searchQ.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  const pinnedNotes = filtered.filter(n => n.pinned);
  const unpinnedNotes = filtered.filter(n => !n.pinned);

  return (
    <div className="flex h-full w-full bg-[#1C1C1E] text-white select-none font-sans text-xs overflow-hidden">
      {/* Sidebar Folders */}
      <div className="w-48 border-r border-white/8 p-3 bg-[#252528]/90 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <FileText size={16} />
              <span>Notes</span>
            </div>
            <button
              onClick={handleCreateNote}
              className="p-1 rounded-md bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <nav className="space-y-0.5">
            {[
              { id: 'All', label: 'All Notes', count: notes.length },
              { id: 'Notes', label: 'Quick Notes', count: notes.filter(n => n.folder === 'Notes').length },
              { id: 'Work', label: 'Work', count: notes.filter(n => n.folder === 'Work').length },
              { id: 'Personal', label: 'Personal', count: notes.filter(n => n.folder === 'Personal').length },
            ].map(folder => (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeFolder === folder.id ? 'bg-amber-400 text-slate-950 font-bold' : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder size={13} />
                  {folder.label}
                </span>
                <span className={`text-[10px] ${activeFolder === folder.id ? 'text-slate-900 font-bold' : 'text-white/30'}`}>{folder.count}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-[10px] text-white/40 space-y-1">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Sparkles size={11} /> iCloud Sync
          </div>
          <div>All notes saved automatically to local memory.</div>
        </div>
      </div>

      {/* Notes List */}
      <div className="w-60 border-r border-white/8 bg-[#252528]/50 flex flex-col">
        {/* Search */}
        <div className="p-3 border-b border-white/8">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-2 text-white/40" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-0.5 p-2">
          {/* Pinned */}
          {pinnedNotes.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-amber-400/80 uppercase tracking-widest flex items-center gap-1">
                <Pin size={10} /> Pinned
              </div>
              {pinnedNotes.map(n => (
                <NoteRow key={n.id} note={n} active={n.id === activeId} onClick={() => setActiveId(n.id)} onPin={handleTogglePin} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {/* Unpinned */}
          {unpinnedNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && <div className="px-2 py-1 text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">Notes</div>}
              {unpinnedNotes.map(n => (
                <NoteRow key={n.id} note={n} active={n.id === activeId} onClick={() => setActiveId(n.id)} onPin={handleTogglePin} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-white/30 text-xs">No notes found</div>
          )}
        </div>
      </div>

      {/* Editor & Preview Pane */}
      {activeNote ? (
        <div className="flex-1 flex flex-col bg-[#1C1C1E] overflow-hidden">
          {/* Toolbar */}
          <div className="h-10 px-4 border-b border-white/8 flex items-center justify-between bg-white/3">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateActive('title', e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none max-w-sm"
              placeholder="Note Title..."
            />
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleTogglePin(activeNote.id, e)}
                className={`p-1.5 rounded-lg border transition-all ${
                  activeNote.pinned ? 'bg-amber-400/20 border-amber-400/40 text-amber-300' : 'border-white/10 text-white/40 hover:text-white'
                }`}
                title="Pin Note"
              >
                <Pin size={13} />
              </button>
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isPreview ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/8 text-white/70 hover:bg-white/15 hover:text-white'
                }`}
              >
                {isPreview ? <Edit3 size={13} /> : <Eye size={13} />}
                <span>{isPreview ? 'Edit' : 'Preview'}</span>
              </button>
            </div>
          </div>

          {/* Main Body */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isPreview ? (
              <div className="prose prose-invert max-w-none text-xs leading-relaxed font-sans text-white/80 whitespace-pre-wrap">
                {activeNote.content}
              </div>
            ) : (
              <textarea
                value={activeNote.content}
                onChange={(e) => updateActive('content', e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full h-full bg-transparent text-xs text-white focus:outline-none resize-none font-mono leading-relaxed placeholder-white/20"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/30 text-xs">No note selected</div>
      )}
    </div>
  );
};

const NoteRow = ({ note, active, onClick, onPin, onDelete }) => (
  <div
    onClick={onClick}
    className={`p-2.5 rounded-xl cursor-pointer transition-all border group ${
      active ? 'bg-amber-400/20 border-amber-400/40 text-amber-100' : 'hover:bg-white/5 border-transparent text-white/80'
    }`}
  >
    <div className="flex items-center justify-between">
      <h4 className="font-bold text-xs truncate max-w-[130px]">{note.title || 'Untitled'}</h4>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => onPin(note.id, e)} className="hover:text-amber-400 text-white/40">
          <Pin size={11} className={note.pinned ? 'text-amber-400 fill-amber-400' : ''} />
        </button>
        <button onClick={(e) => onDelete(note.id, e)} className="hover:text-rose-400 text-white/40">
          <Trash2 size={11} />
        </button>
      </div>
    </div>
    <p className="text-[10px] text-white/40 line-clamp-1 mt-1 font-mono">{note.content.replace(/#|\*/g, '')}</p>
    <span className="text-[9px] text-white/30 mt-1 block font-mono">{note.date}</span>
  </div>
);
