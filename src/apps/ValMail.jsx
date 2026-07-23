import React, { useState } from 'react';
import { 
  Mail, Inbox, Send, Trash2, Star, Edit3, Search, Check, 
  Archive, Reply, Forward, Paperclip, Image as ImageIcon,
  ChevronRight, Filter, AlertCircle
} from 'lucide-react';
import { sounds } from '../utils/soundEngine';

const INITIAL_EMAILS = [
  {
    id: 'e1',
    sender: 'Tim Cook',
    email: 'tcook@apple.com',
    avatar: null,
    gradient: 'from-slate-700 to-slate-900',
    subject: 'Welcome to macOS 26 Tahoe Keynote 2026',
    preview: 'We are thrilled to introduce the next generation Liquid Glass UI framework...',
    body: `Dear Alex,

We are thrilled to introduce the next generation Liquid Glass UI framework for macOS 26 Tahoe.

Featuring Chromium displacement refraction filters, spatial window depth, and Web Audio synthesizer chimes, macOS Tahoe represents the bleeding edge of desktop operating systems.

Attached below is the official Keynote banner asset for your press kit.

Best regards,
Tim Cook
CEO, Apple Inc.`,
    attachment: '/keynote_attachment.jpg',
    attachmentName: 'macOS_Tahoe_Keynote_Banner.jpg',
    time: '10:45 AM',
    unread: true,
    starred: true,
    folder: 'inbox'
  },
  {
    id: 'e2',
    sender: 'Maya Chen',
    email: 'maya.chen@mac.com',
    avatar: '/avatar_maya.jpg',
    gradient: 'from-purple-500 to-pink-500',
    subject: 'Liquid Glass SVG Shader Spec Review',
    preview: 'Hey Alex, I reviewed the feTurbulence frequency values for the window edge refraction...',
    body: `Hey Alex,

I reviewed the feTurbulence frequency values for the window edge refraction effect. 

The baseFrequency of 0.015 paired with numOctaves=2 gives an incredibly smooth liquid ripple without causing GPU frame drops.

Let's sync during the 4 PM design review!

Best,
Maya`,
    attachment: null,
    time: '9:15 AM',
    unread: true,
    starred: true,
    folder: 'inbox'
  },
  {
    id: 'e3',
    sender: 'Craig Federighi',
    email: 'hairforceone@apple.com',
    avatar: null,
    gradient: 'from-blue-600 to-indigo-600',
    subject: 'Parabolic Dock Physics & Spring Animations',
    preview: 'Check out the new bezier scale curves on icon hover for the dock...',
    body: `Hey Team,

Check out the new bezier scale curves on icon hover for the dock. The parabolic physics equation makes window launching feel instantaneous.

Let me know your thoughts on the genie minimize effect!

Cheers,
Craig`,
    attachment: null,
    time: 'Yesterday',
    unread: false,
    starred: false,
    folder: 'inbox'
  },
  {
    id: 'e4',
    sender: 'Sam Okafor',
    email: 'sam.okafor@mac.com',
    avatar: '/avatar_sam.jpg',
    gradient: 'from-blue-500 to-cyan-500',
    subject: 'Darwin Kernel Performance Benchmarks',
    preview: 'Initial test runs on 3D Minimax AI and spatial audio rendering look stellar...',
    body: `Hi Alex,

Initial test runs on 3D Minimax AI and spatial audio rendering look stellar. 

Memory usage stays below 450MB under heavy window multitasking. Great job on the React state optimization!

Regards,
Sam`,
    attachment: null,
    time: 'Jul 21',
    unread: false,
    starred: false,
    folder: 'inbox'
  }
];

export const ValMail = () => {
  const [emails, setEmails] = useState(INITIAL_EMAILS);
  const [activeId, setActiveId] = useState('e1');
  const [activeFolder, setActiveFolder] = useState('inbox'); // inbox | starred | sent | trash
  const [searchQ, setSearchQ] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const activeEmail = emails.find(e => e.id === activeId);

  const handleSendCompose = (e) => {
    e.preventDefault();
    sounds.playClick();
    const newMail = {
      id: Date.now().toString(),
      sender: 'Alex Rivera (Me)',
      email: 'alex@mac.com',
      avatar: '/avatar_alex.jpg',
      gradient: 'from-emerald-400 to-teal-600',
      subject: composeSubject || '(No Subject)',
      preview: composeBody.slice(0, 60),
      body: composeBody,
      attachment: null,
      time: 'Just now',
      unread: false,
      starred: false,
      folder: 'sent'
    };
    setEmails([newMail, ...emails]);
    setActiveId(newMail.id);
    setIsComposing(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
  };

  const handleToggleStar = (id, e) => {
    e.stopPropagation();
    sounds.playClick();
    setEmails(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  const handleDelete = (id, e) => {
    e?.stopPropagation();
    sounds.playClick();
    setEmails(prev => prev.map(m => m.id === id ? { ...m, folder: 'trash' } : m));
  };

  const filtered = emails.filter(m => {
    if (activeFolder === 'starred') if (!m.starred) return false;
    if (activeFolder === 'inbox') if (m.folder !== 'inbox') return false;
    if (activeFolder === 'sent') if (m.folder !== 'sent') return false;
    if (activeFolder === 'trash') if (m.folder !== 'trash') return false;

    if (!searchQ.trim()) return true;
    const q = searchQ.toLowerCase();
    return m.subject.toLowerCase().includes(q) || m.sender.toLowerCase().includes(q) || m.body.toLowerCase().includes(q);
  });

  const unreadCount = emails.filter(e => e.folder === 'inbox' && e.unread).length;

  return (
    <div className="flex h-full w-full bg-[#1C1C1E] text-white select-none font-sans text-xs overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 border-r border-white/8 p-3 bg-[#252528]/90 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#007AFF] font-bold text-sm px-1">
            <Mail size={16} />
            <span>Mail</span>
          </div>

          <nav className="space-y-0.5">
            {[
              { id: 'inbox', label: 'Inbox', icon: Inbox, badge: unreadCount },
              { id: 'starred', label: 'VIP / Starred', icon: Star, badge: emails.filter(e => e.starred).length },
              { id: 'sent', label: 'Sent', icon: Send },
              { id: 'trash', label: 'Trash', icon: Trash2 },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveFolder(item.id); setIsComposing(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeFolder === item.id ? 'bg-[#007AFF] text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <item.icon size={14} />
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeFolder === item.id ? 'bg-white text-[#007AFF]' : 'bg-white/10 text-white/70'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={() => { setIsComposing(true); sounds.playClick(); }}
          className="w-full py-2 rounded-xl bg-[#007AFF] hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Edit3 size={14} /> Compose
        </button>
      </div>

      {/* Email List */}
      <div className="w-64 border-r border-white/8 bg-[#252528]/50 flex flex-col">
        <div className="p-3 border-b border-white/8">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-2 text-white/40" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search emails..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#007AFF]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-0.5 p-2">
          {filtered.map(m => {
            const isSel = m.id === activeId && !isComposing;
            return (
              <div
                key={m.id}
                onClick={() => { 
                  setActiveId(m.id); 
                  setIsComposing(false);
                  setEmails(prev => prev.map(x => x.id === m.id ? { ...x, unread: false } : x));
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  isSel ? 'bg-[#007AFF]/20 border-[#007AFF]/40' : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {m.avatar ? (
                      <img src={m.avatar} alt={m.sender} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${m.gradient} text-[9px] font-bold text-white flex items-center justify-center`}>
                        {m.sender[0]}
                      </div>
                    )}
                    <span className={`font-bold text-xs truncate ${m.unread ? 'text-white' : 'text-white/80'}`}>{m.sender}</span>
                  </div>
                  <span className="text-[10px] text-white/40 flex-shrink-0">{m.time}</span>
                </div>
                <div className={`font-semibold text-xs truncate mb-1 ${m.unread ? 'text-[#007AFF]' : 'text-white/90'}`}>{m.subject}</div>
                <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed">{m.preview}</p>

                <div className="flex justify-between items-center mt-2 pt-1 border-t border-white/5">
                  {m.attachment ? (
                    <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-medium">
                      <Paperclip size={10} /> Attachment
                    </span>
                  ) : <span />}
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => handleToggleStar(m.id, e)} className="hover:text-amber-400">
                      <Star size={11} className={m.starred ? 'text-amber-400 fill-amber-400' : 'text-white/30'} />
                    </button>
                    <button onClick={(e) => handleDelete(m.id, e)} className="hover:text-rose-400 text-white/30">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-white/30 text-xs">No emails in {activeFolder}</div>
          )}
        </div>
      </div>

      {/* Reader / Compose */}
      {isComposing ? (
        <form onSubmit={handleSendCompose} className="flex-1 p-6 bg-[#1C1C1E] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/8 pb-3">
              <h2 className="text-sm font-bold text-white">New Message</h2>
              <button type="button" onClick={() => setIsComposing(false)} className="text-xs text-white/50 hover:text-white">Cancel</button>
            </div>
            <input
              type="email" value={composeTo} onChange={e => setComposeTo(e.target.value)}
              placeholder="To: recipient@mac.com" required
              className="w-full px-3 py-2 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#007AFF]"
            />
            <input
              type="text" value={composeSubject} onChange={e => setComposeSubject(e.target.value)}
              placeholder="Subject..." required
              className="w-full px-3 py-2 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#007AFF]"
            />
            <textarea
              value={composeBody} onChange={e => setComposeBody(e.target.value)}
              placeholder="Write your message here..." rows={12} required
              className="w-full p-3 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none font-sans leading-relaxed resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-white/8">
            <button type="button" onClick={() => setIsComposing(false)} className="px-4 py-1.5 rounded-lg bg-white/10 text-xs font-semibold text-white/70 hover:bg-white/20">Cancel</button>
            <button type="submit" className="px-5 py-1.5 rounded-lg bg-[#007AFF] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg hover:bg-blue-500">
              <Send size={13} /> Send Email
            </button>
          </div>
        </form>
      ) : activeEmail ? (
        <div className="flex-1 p-6 bg-[#1C1C1E] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6 max-w-2xl">
            {/* Header */}
            <div className="border-b border-white/8 pb-4 space-y-3">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-white leading-snug">{activeEmail.subject}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggleStar(activeEmail.id, { stopPropagation: ()=>{} })} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                    <Star size={14} className={activeEmail.starred ? 'text-amber-400 fill-amber-400' : 'text-white/40'} />
                  </button>
                  <button onClick={() => handleDelete(activeEmail.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-rose-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {activeEmail.avatar ? (
                  <img src={activeEmail.avatar} alt={activeEmail.sender} className="w-10 h-10 rounded-full object-cover shadow" />
                ) : (
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${activeEmail.gradient} font-bold text-sm text-white flex items-center justify-center shadow`}>
                    {activeEmail.sender[0]}
                  </div>
                )}
                <div>
                  <div className="font-bold text-xs text-white">{activeEmail.sender}</div>
                  <div className="text-[10px] text-white/40 font-mono">&lt;{activeEmail.email}&gt;</div>
                </div>
                <span className="ml-auto text-[10px] text-white/40 font-mono">{activeEmail.time}</span>
              </div>
            </div>

            {/* Body */}
            <div className="text-xs text-white/80 leading-relaxed font-sans whitespace-pre-wrap">
              {activeEmail.body}
            </div>

            {/* Attachment preview if present */}
            {activeEmail.attachment && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-white/80">
                  <span className="flex items-center gap-2">
                    <ImageIcon size={14} className="text-[#007AFF]" /> {activeEmail.attachmentName}
                  </span>
                  <a href={activeEmail.attachment} target="_blank" rel="noreferrer" className="text-[#007AFF] hover:underline text-[11px]">View Full</a>
                </div>
                <img src={activeEmail.attachment} alt="Attachment" className="w-full rounded-xl shadow-xl border border-white/10 object-cover max-h-64" />
              </div>
            )}
          </div>

          {/* Quick Reply Bar */}
          <div className="pt-6 border-t border-white/8 flex gap-2">
            <button
              onClick={() => { setComposeTo(activeEmail.email); setComposeSubject(`Re: ${activeEmail.subject}`); setIsComposing(true); }}
              className="px-4 py-2 rounded-xl bg-white/8 hover:bg-white/15 text-xs text-white font-semibold flex items-center gap-2"
            >
              <Reply size={13} /> Reply
            </button>
            <button
              onClick={() => { setComposeSubject(`Fwd: ${activeEmail.subject}`); setComposeBody(`\n\n---------- Forwarded message ----------\nFrom: ${activeEmail.sender}\nSubject: ${activeEmail.subject}\n\n${activeEmail.body}`); setIsComposing(true); }}
              className="px-4 py-2 rounded-xl bg-white/8 hover:bg-white/15 text-xs text-white font-semibold flex items-center gap-2"
            >
              <Forward size={13} /> Forward
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/30 text-xs">No email selected</div>
      )}
    </div>
  );
};
