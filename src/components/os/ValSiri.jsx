import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Sparkles, Mic, X, Send, Volume2, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/soundEngine';

export const ValSiri = () => {
  const { siriOpen, setSiriOpen, openApp, setLockScreenOpen, restartOS, setForceQuitOpen } = useOS();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'siri', text: 'Hi! I am Siri, powered by Apple Intelligence. How can I help you today?' }
  ]);
  const [isListening, setIsListening] = useState(false);

  if (!siriOpen) return null;

  const handleAskSiri = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    sounds.playClick();
    const userQuery = query.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setQuery('');
    setIsListening(true);

    setTimeout(() => {
      setIsListening(false);
      const lower = userQuery.toLowerCase();
      let response = "I can help with system settings, launching apps, and answering queries!";

      if (lower.includes('open') || lower.includes('launch')) {
        if (lower.includes('safari') || lower.includes('browser')) {
          openApp('safari');
          response = "Opening Safari web browser for you.";
        } else if (lower.includes('message') || lower.includes('chat')) {
          openApp('messages');
          response = "Opening iMessage. Maya Chen sent a new update!";
        } else if (lower.includes('mail') || lower.includes('email')) {
          openApp('mail');
          response = "Opening Mail inbox.";
        } else if (lower.includes('terminal') || lower.includes('zsh')) {
          openApp('terminal');
          response = "Opening Terminal zsh shell.";
        } else if (lower.includes('music') || lower.includes('song')) {
          openApp('music');
          response = "Opening Apple Music synth player.";
        } else if (lower.includes('setting') || lower.includes('preference')) {
          openApp('settings');
          response = "Opening System Settings.";
        } else if (lower.includes('finder') || lower.includes('file')) {
          openApp('finder');
          response = "Opening Finder.";
        } else {
          response = `Opening application...`;
        }
      } else if (lower.includes('lock') || lower.includes('sleep')) {
        setLockScreenOpen(true);
        response = "Locking your screen.";
      } else if (lower.includes('force quit') || lower.includes('task manager')) {
        setForceQuitOpen(true);
        response = "Opening Force Quit Applications dialog.";
      } else if (lower.includes('weather') || lower.includes('temperature')) {
        response = "It's currently 68°F and Sunny in Lake Tahoe with a light breeze.";
      } else if (lower.includes('who are you') || lower.includes('what is this')) {
        response = "I am Siri, powered by Apple Intelligence on macOS 26 Tahoe Liquid Glass Edition.";
      }

      sounds.playClick();
      setMessages(prev => [...prev, { sender: 'siri', text: response }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-20 right-6 z-[9200] w-88 rounded-3xl macos-glass p-4 border border-white/20 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-5 duration-200 select-none text-xs text-white font-sans">
      {/* Apple Intelligence Glowing Rainbow Halo Accent */}
      <div className="absolute inset-0 rounded-3xl p-0.5 bg-gradient-to-r from-cyan-500 via-indigo-500 via-pink-500 to-amber-400 opacity-40 pointer-events-none blur-sm" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <Sparkles size={16} className="animate-spin text-cyan-400" />
          <span>Siri — Apple Intelligence</span>
        </div>
        <button onClick={() => setSiriOpen(false)} className="p-1 hover:bg-white/15 rounded-full text-white/60 hover:text-white">
          <X size={14} />
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="relative z-10 h-52 overflow-auto space-y-2.5 p-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
              m.sender === 'user' ? 'bg-[#007AFF] text-white font-medium rounded-br-xs' : 'bg-white/10 text-white/90 rounded-bl-xs border border-white/15'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {isListening && (
          <div className="flex items-center gap-2 text-cyan-300 italic p-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Siri is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleAskSiri} className="relative z-10 flex items-center gap-2 pt-2 border-t border-white/10">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Siri anything..."
          className="flex-1 px-3.5 py-2 rounded-full bg-black/40 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#007AFF]"
        />
        <button type="submit" className="p-2 rounded-full bg-[#007AFF] hover:bg-blue-600 text-white shadow">
          <Send size={13} />
        </button>
      </form>
    </div>
  );
};
