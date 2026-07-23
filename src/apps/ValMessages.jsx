import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  Phone, 
  Video, 
  Info, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles,
  CheckCheck,
  Paperclip,
  Image as ImageIcon,
  Smile
} from 'lucide-react';
import { sounds } from '../utils/soundEngine';

const CONTACTS = {
  'maya': { name: 'Maya Chen', avatar: 'MC', photo: '/avatar_maya.jpg', role: 'UI Lead', gradient: 'from-purple-500 to-pink-500' },
  'sam': { name: 'Sam Okafor', avatar: 'SO', photo: '/avatar_sam.jpg', role: 'Systems Lead', gradient: 'from-blue-500 to-cyan-500' },
  'mom': { name: 'Mom (Linda)', avatar: 'M', photo: null, role: 'Family', gradient: 'from-amber-400 to-rose-500' },
  'alex': { name: 'Alex Rivera', avatar: 'AR', photo: '/avatar_alex.jpg', role: 'Product Lead', gradient: 'from-emerald-400 to-teal-600' },
  'craig': { name: 'Craig Federighi', avatar: 'CF', photo: null, role: 'SVP Software', gradient: 'from-blue-600 to-indigo-600' }
};

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-maya',
    contactKey: 'maya',
    pinned: true,
    unread: 1,
    messages: [
      { id: 'm1', sender: 'them', text: 'Did you test the Chromium SVG refraction filter on the window panels?', at: '2:10 PM' },
      { id: 'm2', sender: 'me', text: 'Just enabled feTurbulence displacement map. The liquid edge optical distortion is insane!', at: '2:14 PM', delivered: true, read: true },
      { id: 'm3', sender: 'them', text: 'Awesome! Review moved to 4 PM — bring the live demo! 🚀', at: '2:25 PM', tapback: '❤️' }
    ]
  },
  {
    id: 'conv-craig',
    contactKey: 'craig',
    pinned: true,
    unread: 0,
    messages: [
      { id: 'm1', sender: 'them', text: 'How is the parabolic dock scale bezier physics coming along?', at: '11:00 AM' },
      { id: 'm2', sender: 'me', text: 'Icons scale at 1.48x peak with smooth spring easing.', at: '11:15 AM', delivered: true, read: true, tapback: '👍' },
      { id: 'm3', sender: 'them', text: 'Hair Force One approves! ✈️', at: '11:20 AM', tapback: '😂' }
    ]
  },
  {
    id: 'conv-sam',
    contactKey: 'sam',
    pinned: false,
    unread: 0,
    messages: [
      { id: 'm1', sender: 'them', text: 'Terminal zsh prompt & matrix rain mode are live.', at: 'Yesterday' },
      { id: 'm2', sender: 'me', text: 'Pushed to main branch.', at: 'Yesterday', delivered: true, read: true }
    ]
  },
  {
    id: 'conv-mom',
    contactKey: 'mom',
    pinned: true,
    unread: 0,
    messages: [
      { id: 'm1', sender: 'them', text: 'Hi dear! Did you eat lunch yet? Call when you have a minute ❤️', at: 'Yesterday' }
    ]
  },
  {
    id: 'conv-alex',
    contactKey: 'alex',
    pinned: false,
    unread: 0,
    messages: [
      { id: 'm1', sender: 'them', text: 'Tahoe OS build 26A302 passed all integration checks.', at: 'Jul 21' }
    ]
  }
];

const CONTACT_REPLIES = {
  'maya': [
    "Love that! Let's ship it to main right away 🚀",
    "Can you send me a quick screenshot of the glass window shader?",
    "Added to the Tahoe design keynote deck!",
    "Refraction at the glass borders is peak UI."
  ],
  'craig': [
    "Boom! That spring animation curve is 100% Apple standard.",
    "Let me know when the Siri assistant voice pod is ready.",
    "Ship it!"
  ],
  'sam': [
    "Benchmarks show 120fps smooth performance.",
    "Want to hop on a FaceTime call to verify?",
    "Pushed the latest kernel update."
  ],
  'mom': [
    "That's great dear 😘 Call me when you get a break!",
    "Your father says hello! Dinner is at 6 on Sunday.",
    "Make sure to get enough sleep!"
  ],
  'alex': [
    "Product roadmap is looking super solid.",
    "Nice work on the macOS pixel-faithful refactor.",
    "Let's sync at 5 PM."
  ]
};

export const ValMessages = () => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('valos_messages_store');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });
  const [activeConvId, setActiveConvId] = useState('conv-maya');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typingContact, setTypingContact] = useState(null);
  const bottomRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const activeContact = CONTACTS[activeConv.contactKey] || CONTACTS['maya'];

  useEffect(() => {
    localStorage.setItem('valos_messages_store', JSON.stringify(conversations));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId, typingContact]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sounds.playClick();
    const newMsg = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim(),
      at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      delivered: true,
      read: true
    };

    setConversations(prev => prev.map(c => c.id === activeConvId ? {
      ...c,
      messages: [...c.messages, newMsg]
    } : c));

    setInputText('');

    // Trigger contact auto-reply with authentic iMessage typing dots bubble!
    const key = activeConv.contactKey;
    setTimeout(() => {
      setTypingContact(activeContact.name);
      setTimeout(() => {
        setTypingContact(null);
        sounds.playClick();

        const replies = CONTACT_REPLIES[key] || ["Sounds great!"];
        const replyText = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'them',
          text: replyText,
          at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prev => prev.map(c => c.id === activeConvId ? {
          ...c,
          messages: [...c.messages, replyMsg]
        } : c));
      }, 2200);
    }, 600);
  };

  const handleToggleTapback = (msgId, emoji) => {
    setConversations(prev => prev.map(c => c.id === activeConvId ? {
      ...c,
      messages: c.messages.map(m => m.id === msgId ? {
        ...m,
        tapback: m.tapback === emoji ? null : emoji
      } : m)
    } : c));
  };

  const filtered = conversations.filter(c => {
    const contact = CONTACTS[c.contactKey];
    return contact?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-full w-full bg-[#1E1E1E] text-white select-none font-sans text-xs">
      {/* Sidebar List */}
      <div className="w-72 border-r border-white/10 p-3 bg-[#252528]/80 backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-white">Messages</h2>
            <button className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white">
              <Plus size={14} />
            </button>
          </div>

          <div className="relative mb-3">
            <Search size={13} className="absolute left-2.5 top-2 text-white/40" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-1 rounded-md bg-white/10 text-xs text-white placeholder-white/40 focus:outline-none"
            />
          </div>

          <div className="space-y-1 overflow-auto max-h-[calc(100vh-180px)]">
            {filtered.map(c => {
              const contact = CONTACTS[c.contactKey];
              const isSel = c.id === activeConvId;
              const lastMsg = c.messages[c.messages.length - 1];
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors flex gap-2.5 items-center ${
                    isSel ? 'bg-[#007AFF] text-white' : 'hover:bg-white/10 text-white/80'
                  }`}
                >
                  {contact.photo ? (
                    <img src={contact.photo} alt={contact.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${contact.gradient} flex items-center justify-center font-bold text-xs text-white flex-shrink-0`}>
                      {contact.avatar}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className={`font-semibold text-xs truncate ${isSel ? 'text-white' : 'text-white/90'}`}>{contact.name}</span>
                      <span className={`text-[10px] ${isSel ? 'text-white/80' : 'text-white/40'}`}>{lastMsg?.at}</span>
                    </div>
                    <p className={`text-[11px] truncate ${isSel ? 'text-white/90' : 'text-white/50'}`}>
                      {lastMsg?.sender === 'me' ? 'You: ' : ''}{lastMsg?.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="flex-1 flex flex-col bg-[#1E1E1E]">
        {/* Top Header */}
        <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            {activeContact.photo ? (
              <img src={activeContact.photo} alt={activeContact.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${activeContact.gradient} flex items-center justify-center font-bold text-white text-xs flex-shrink-0`}>
                {activeContact.avatar}
              </div>
            )}
            <div>
              <h3 className="font-bold text-xs text-white">{activeContact.name}</h3>
              <span className="text-[10px] text-white/50">{activeContact.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <button className="p-1 hover:text-white rounded hover:bg-white/10"><Phone size={15} /></button>
            <button className="p-1 hover:text-white rounded hover:bg-white/10"><Video size={16} /></button>
            <button className="p-1 hover:text-white rounded hover:bg-white/10"><Info size={16} /></button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-auto space-y-3">
          {activeConv.messages.map(m => {
            const isMe = m.sender === 'me';
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}>
                <div className="relative">
                  <div className={`px-3.5 py-2 rounded-2xl max-w-sm text-[12px] leading-relaxed ${
                    isMe 
                      ? 'bg-[#007AFF] text-white font-medium rounded-br-xs shadow' 
                      : 'bg-[#2C2C2E] text-white/90 rounded-bl-xs border border-white/10'
                  }`}>
                    {m.text}
                  </div>

                  {/* Tapback Badge */}
                  {m.tapback && (
                    <span className="absolute -top-2 -right-2 bg-[#2C2C2E] border border-white/20 rounded-full px-1.5 py-0.5 text-[10px] shadow">
                      {m.tapback}
                    </span>
                  )}

                  {/* Tapback Picker Menu */}
                  <div className={`absolute top-0 ${isMe ? '-left-20' : '-right-20'} hidden group-hover:flex items-center gap-1 bg-[#2C2C2E] border border-white/20 p-1 rounded-full shadow-lg z-20`}>
                    {['❤️', '👍', '😂', '❓'].map(emoji => (
                      <button key={emoji} onClick={() => handleToggleTapback(m.id, emoji)} className="hover:scale-125 transition-transform text-xs">
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[9px] text-white/40 px-1 font-mono">
                  <span>{m.at}</span>
                  {isMe && <span>• Delivered</span>}
                </div>
              </div>
            );
          })}

          {/* Authentic iOS/macOS Typing Indicator Dots Bubble */}
          {typingContact && (
            <div className="flex flex-col items-start space-y-1 animate-in fade-in duration-200">
              <div className="px-4 py-3 rounded-2xl bg-[#2C2C2E] border border-white/10 rounded-bl-xs shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '180ms' }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '360ms' }} />
              </div>
              <span className="text-[9px] text-white/40 px-1 font-mono">{typingContact} is typing...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#252528]/60 flex items-center gap-2">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`iMessage to ${activeContact.name}...`}
            className="flex-1 px-4 py-2 rounded-full bg-[#1C1C1E] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#007AFF]"
          />
          <button 
            type="submit"
            className="p-2 rounded-full bg-[#007AFF] hover:bg-blue-600 text-white font-bold transition-transform active:scale-95 shadow"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
