import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import { 
  Users, Search, Plus, MessageSquare, Video, Mail, Phone, 
  Star, MapPin, ChevronRight, Edit3, X, Check
} from 'lucide-react';
import { sounds } from '../utils/soundEngine';

const INITIAL_CONTACTS = [
  { 
    id: 'c1', name: 'Maya Chen', title: 'Lead UI Architect', 
    avatar: '/avatar_maya.jpg', gradient: 'from-purple-500 to-pink-500', 
    phone: '+1 (555) 234-5678', email: 'maya.chen@mac.com', 
    location: 'Cupertino, CA', starred: true, birthday: 'March 12',
    notes: 'Works on the Liquid Glass design system at Apple.'
  },
  { 
    id: 'c2', name: 'Sam Okafor', title: 'Systems Engineer',
    avatar: '/avatar_sam.jpg', gradient: 'from-blue-500 to-cyan-500',
    phone: '+1 (555) 345-6789', email: 'sam.okafor@mac.com',
    location: 'Lake Tahoe, CA', starred: false, birthday: 'July 4',
    notes: 'Met at WWDC 2026. Works on macOS kernel.'
  },
  { 
    id: 'c3', name: 'Craig Federighi', title: 'SVP Software Engineering',
    avatar: null, gradient: 'from-blue-600 to-indigo-600',
    phone: '+1 (408) 996-1010', email: 'hairforceone@apple.com',
    location: 'Cupertino, CA', starred: true, birthday: 'April 18',
    notes: 'Hair Force One. macOS & iOS lead.'
  },
  { 
    id: 'c4', name: 'Mom (Linda)', title: 'Family',
    avatar: null, gradient: 'from-amber-400 to-rose-500',
    phone: '+1 (555) 901-2345', email: 'linda@family.com',
    location: 'San Francisco, CA', starred: true, birthday: 'June 5',
    notes: 'Call every Sunday!'
  },
  { 
    id: 'c5', name: 'Tim Cook', title: 'Apple CEO',
    avatar: null, gradient: 'from-slate-600 to-slate-800',
    phone: '+1 (408) 996-1010', email: 'tcook@apple.com',
    location: 'Cupertino, CA', starred: true, birthday: 'November 1',
    notes: 'CEO of Apple Inc. since 2011.'
  },
  { 
    id: 'c6', name: 'Jordan Lee', title: 'Product Designer',
    avatar: null, gradient: 'from-emerald-500 to-teal-500',
    phone: '+1 (555) 678-9012', email: 'jordan.lee@studio.com',
    location: 'San Jose, CA', starred: false, birthday: 'September 20',
    notes: 'Freelance product designer. Portfolio: jordanlee.design'
  },
];

const AvatarDisplay = ({ contact, size = 'md', className = '' }) => {
  const sz = size === 'lg' ? 'w-28 h-28 text-4xl' : size === 'sm' ? 'w-9 h-9 text-sm' : 'w-10 h-10 text-base';
  const initials = contact.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  if (contact.avatar) {
    return (
      <img 
        src={contact.avatar} alt={contact.name}
        className={`${sz} rounded-full object-cover flex-shrink-0 shadow-lg ${className}`}
      />
    );
  }
  return (
    <div className={`${sz} rounded-full bg-gradient-to-tr ${contact.gradient} flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg ${className}`}>
      {initials}
    </div>
  );
};

export const ValContacts = () => {
  const { openApp } = useOS();
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [activeId, setActiveId] = useState('c1');
  const [searchQ, setSearchQ] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const active = contacts.find(c => c.id === activeId) || contacts[0];

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQ.toLowerCase())
  );

  const grouped = filtered.reduce((acc, c) => {
    const letter = c.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(c);
    return acc;
  }, {});

  const handleToggleStar = (id, e) => {
    e.stopPropagation();
    sounds.playClick();
    setContacts(prev => prev.map(c => c.id === id ? { ...c, starred: !c.starred } : c));
  };

  const startEdit = () => {
    setEditData({ ...active });
    setEditMode(true);
  };

  const saveEdit = () => {
    setContacts(prev => prev.map(c => c.id === active.id ? { ...c, ...editData } : c));
    setEditMode(false);
    setEditData(null);
  };

  const addContact = () => {
    const newC = {
      id: Date.now().toString(), name: 'New Contact', title: '',
      avatar: null, gradient: 'from-slate-500 to-slate-700',
      phone: '', email: '', location: '', starred: false, birthday: '', notes: ''
    };
    setContacts(prev => [...prev, newC]);
    setActiveId(newC.id);
    setEditData({ ...newC });
    setEditMode(true);
    sounds.playClick();
  };

  return (
    <div className="flex h-full w-full bg-[#1C1C1E] text-white select-none font-sans text-xs overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 border-r border-white/8 flex flex-col bg-[#252528]/90 backdrop-blur-md">
        {/* Header */}
        <div className="px-3 py-2.5 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#007AFF] font-bold text-sm">
            <Users size={15} />
            <span>Contacts</span>
          </div>
          <button onClick={addContact} className="p-1 rounded-md bg-white/8 hover:bg-white/20 text-white transition-colors">
            <Plus size={13} />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-white/8">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-2 text-white/40" />
            <input
              type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#007AFF]"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {/* Starred */}
          {!searchQ && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest sticky top-0 bg-[#252528]/90">Favorites</div>
              {contacts.filter(c => c.starred).map(c => (
                <ContactRow key={c.id} contact={c} active={c.id === activeId} onClick={() => { setActiveId(c.id); setEditMode(false); }} onStar={handleToggleStar} />
              ))}
            </div>
          )}

          {/* Alphabetical groups */}
          {Object.keys(grouped).sort().map(letter => (
            <div key={letter}>
              <div className="px-3 py-1 text-[10px] font-bold text-white/30 uppercase tracking-widest sticky top-0 bg-[#252528]/90">{letter}</div>
              {grouped[letter].map(c => (
                <ContactRow key={c.id} contact={c} active={c.id === activeId} onClick={() => { setActiveId(c.id); setEditMode(false); }} onStar={handleToggleStar} />
              ))}
            </div>
          ))}
        </div>

        <div className="px-3 py-2 border-t border-white/8 text-[10px] text-white/30 text-center">{contacts.length} contacts</div>
      </div>

      {/* Detail pane */}
      <div className="flex-1 overflow-auto bg-[#1C1C1E]">
        {editMode && editData ? (
          /* Edit form */
          <div className="max-w-lg mx-auto p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white">Edit Contact</h2>
              <div className="flex gap-2">
                <button onClick={() => setEditMode(false)} className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white/70 hover:bg-white/20">Cancel</button>
                <button onClick={saveEdit} className="px-3 py-1.5 rounded-lg bg-[#007AFF] text-xs text-white font-semibold hover:bg-blue-500">Done</button>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <AvatarDisplay contact={editData} size="lg" />
            </div>

            {[
              { key: 'name', label: 'Full Name', placeholder: 'Full Name' },
              { key: 'title', label: 'Job Title', placeholder: 'Job Title' },
              { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000' },
              { key: 'email', label: 'Email', placeholder: 'email@example.com' },
              { key: 'location', label: 'Location', placeholder: 'City, State' },
              { key: 'birthday', label: 'Birthday', placeholder: 'Month Day' },
              { key: 'notes', label: 'Notes', placeholder: 'Add notes...' },
            ].map(f => (
              <div key={f.key} className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-wide">{f.label}</label>
                <input
                  type="text" value={editData[f.key] || ''}
                  onChange={e => setEditData(d => ({ ...d, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#007AFF]"
                />
              </div>
            ))}
          </div>
        ) : (
          /* View mode */
          <div className="flex flex-col items-center py-8 px-6 space-y-6">
            {/* Header Card */}
            <div className="w-full max-w-md p-6 rounded-3xl bg-white/5 border border-white/10 shadow-2xl space-y-4 text-center">
              <div className="relative inline-block">
                <AvatarDisplay contact={active} size="lg" />
                <button
                  onClick={e => handleToggleStar(active.id, e)}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#2C2C2E] border border-white/20 text-amber-400 shadow-lg hover:scale-110 transition-transform"
                >
                  <Star size={13} className={active.starred ? 'fill-amber-400' : ''} />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{active.name}</h2>
                <p className="text-xs text-[#007AFF] font-semibold mt-0.5">{active.title}</p>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Message', icon: MessageSquare, color: 'text-emerald-400', action: () => openApp('messages') },
                  { label: 'FaceTime', icon: Video, color: 'text-emerald-400', action: () => openApp('facetime') },
                  { label: 'Mail', icon: Mail, color: 'text-[#007AFF]', action: () => openApp('mail') },
                  { label: 'Call', icon: Phone, color: 'text-emerald-400', action: () => openApp('facetime') },
                ].map(a => (
                  <button key={a.label} onClick={a.action} className="p-3 rounded-2xl bg-white/8 hover:bg-white/15 flex flex-col items-center gap-1 transition-all active:scale-95">
                    <a.icon size={18} className={a.color} />
                    <span className="text-[10px] font-medium text-white/70">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="w-full max-w-md space-y-2">
              {[
                { label: 'Phone', value: active.phone, icon: Phone },
                { label: 'Email', value: active.email, icon: Mail },
                { label: 'Location', value: active.location, icon: MapPin },
                { label: 'Birthday', value: active.birthday, icon: Star },
              ].filter(d => d.value).map(detail => (
                <div key={detail.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                  <detail.icon size={14} className="text-white/40 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-white/40 uppercase tracking-wide">{detail.label}</div>
                    <div className="text-xs font-semibold text-white mt-0.5 truncate">{detail.value}</div>
                  </div>
                  <ChevronRight size={13} className="text-white/20" />
                </div>
              ))}
              {active.notes && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                  <div className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Notes</div>
                  <p className="text-xs text-white/70 leading-relaxed">{active.notes}</p>
                </div>
              )}
            </div>

            <button onClick={startEdit} className="flex items-center gap-1.5 text-[#007AFF] text-xs font-semibold hover:underline">
              <Edit3 size={12} /> Edit Contact
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ContactRow = ({ contact, active, onClick, onStar }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
      active ? 'bg-[#007AFF] text-white' : 'hover:bg-white/5 text-white/80'
    }`}
  >
    <AvatarDisplay contact={contact} size="sm" />
    <div className="flex-1 min-w-0">
      <div className={`font-semibold text-xs truncate ${active ? 'text-white' : 'text-white'}`}>{contact.name}</div>
      <div className={`text-[10px] truncate ${active ? 'text-white/75' : 'text-white/40'}`}>{contact.title}</div>
    </div>
    {contact.starred && <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
  </div>
);
