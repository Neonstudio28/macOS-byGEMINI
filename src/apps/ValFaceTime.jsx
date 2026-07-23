import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Phone, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  Share2, 
  Plus, 
  Search, 
  Volume2, 
  Sparkles,
  Users,
  Camera
} from 'lucide-react';
import { sounds } from '../utils/soundEngine';

const CONTACTS = [
  { 
    id: 'c1', 
    name: 'Maya Chen', 
    role: 'UI Lead', 
    avatar: 'MC',
    photo: '/avatar_maya.jpg',
    gradient: 'from-purple-500 to-pink-500', 
    phone: '+1 (555) 234-5678',
    speech: "Hey! Did you check out the new Liquid Glass shaders in macOS 26 Tahoe? It looks absolutely incredible!" 
  },
  { 
    id: 'c2', 
    name: 'Craig Federighi', 
    role: 'SVP Software', 
    avatar: 'CF',
    photo: null,
    gradient: 'from-blue-600 to-indigo-600', 
    phone: '+1 (555) 789-0123',
    speech: "Hair Force One here! The parabolic dock scale physics and spring animations are buttery smooth." 
  },
  { 
    id: 'c3', 
    name: 'Sam Okafor', 
    role: 'Systems Lead', 
    avatar: 'SO',
    photo: '/avatar_sam.jpg',
    gradient: 'from-blue-500 to-cyan-500', 
    phone: '+1 (555) 345-6789',
    speech: "Hey! The Darwin kernel benchmarks and 120fps frame rates are looking rock solid." 
  },
  { 
    id: 'c4', 
    name: 'Mom (Linda)', 
    role: 'Family', 
    avatar: 'M',
    photo: null,
    gradient: 'from-amber-400 to-rose-500', 
    phone: '+1 (555) 901-2345',
    speech: "Hi dear! Make sure to eat lunch and don't forget dinner on Sunday at 6 PM!" 
  },
  { 
    id: 'c5', 
    name: 'Tim Cook', 
    role: 'Apple CEO', 
    avatar: 'TC', 
    gradient: 'from-slate-600 to-slate-800', 
    phone: '+1 (555) 000-0001',
    speech: "Good morning! We are thrilled to welcome you to the macOS 26 Tahoe Keynote!" 
  }
];

export const ValFaceTime = () => {
  const [activeContactId, setActiveContactId] = useState('c1');
  const [callState, setCallState] = useState('idle'); // 'idle' | 'ringing' | 'connected'
  const [callType, setCallType] = useState('video'); // 'video' | 'audio'
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [useWebcam, setUseWebcam] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const activeContact = CONTACTS.find(c => c.id === activeContactId) || CONTACTS[0];

  // Speech Synthesis caller voice function
  const speakContactVoice = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // clear previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = activeContact.id === 'c4' ? 1.2 : 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Webcam stream attempt
  const enableWebcam = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setUseWebcam(true);
        }
      }
    } catch (err) {
      setUseWebcam(false);
    }
  };

  // Call timer simulation & Speech trigger
  useEffect(() => {
    let interval;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);

      // Trigger actual voice speech when call connects!
      speakContactVoice(activeContact.speech);

      // Try enabling webcam if video call
      if (callType === 'video') {
        enableWebcam();
      }
    } else {
      setCallDuration(0);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [callState, activeContactId]);

  // Canvas particle animation for video stream simulation
  useEffect(() => {
    if (callState === 'connected' && callType === 'video' && !useWebcam) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let animId;
      let angle = 0;

      const render = () => {
        angle += 0.03;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render animated light waves
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(
            canvas.width / 2 + Math.cos(angle + i) * 60,
            canvas.height / 2 + Math.sin(angle + i) * 40,
            40 + i * 15,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(0, 122, 255, ${0.15 - i * 0.02})`;
          ctx.fill();
        }
        animId = requestAnimationFrame(render);
      };
      render();
      return () => cancelAnimationFrame(animId);
    }
  }, [callState, callType, useWebcam]);

  const handleStartCall = (type) => {
    sounds.playClick();
    setCallType(type);
    setCallState('ringing');

    setTimeout(() => {
      sounds.playBoot();
      setCallState('connected');
    }, 2200);
  };

  const handleEndCall = () => {
    sounds.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCallState('idle');
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredContacts = CONTACTS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full bg-[#1E1E1E] text-white select-none font-sans">
      {/* Sidebar Contacts */}
      <div className="w-64 border-r border-white/10 p-3 bg-[#252528]/80 backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Video size={18} />
              <span>FaceTime</span>
            </div>
            <button className="p-1 rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs flex items-center gap-1 font-semibold">
              <Plus size={14} /> New Call
            </button>
          </div>

          <div className="relative mb-3">
            <Search size={13} className="absolute left-2.5 top-2 text-white/40" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FaceTime..."
              className="w-full pl-8 pr-3 py-1 rounded-md bg-white/10 text-xs text-white placeholder-white/40 focus:outline-none"
            />
          </div>

          <div className="space-y-1 overflow-auto max-h-[calc(100vh-180px)]">
            {filteredContacts.map(c => {
              const isSel = c.id === activeContactId;
              return (
                <div
                  key={c.id}
                  onClick={() => { setActiveContactId(c.id); if (callState === 'connected') speakContactVoice(c.speech); }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${
                    isSel ? 'bg-[#007AFF] text-white' : 'hover:bg-white/10 text-white/80'
                  }`}
                >
                  {c.photo ? (
                    <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow" />
                  ) : (
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${c.gradient} flex items-center justify-center font-bold text-white text-xs flex-shrink-0 shadow`}>
                      {c.avatar}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs truncate">{c.name}</h4>
                    <p className={`text-[10px] truncate ${isSel ? 'text-white/80' : 'text-white/40'}`}>{c.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main FaceTime Screen */}
      <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
        {callState === 'idle' ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-6 text-center">
            <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${activeContact.gradient} flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-white/20`}>
              {activeContact.avatar}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">{activeContact.name}</h2>
              <p className="text-xs text-emerald-400 font-semibold">{activeContact.role}</p>
              <p className="text-xs text-white/40 font-mono">{activeContact.phone}</p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button 
                onClick={() => handleStartCall('video')}
                className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl transition-transform active:scale-95"
              >
                <Video size={16} /> FaceTime Video
              </button>
              <button 
                onClick={() => handleStartCall('audio')}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 shadow-xl transition-transform active:scale-95 border border-white/20"
              >
                <Phone size={15} /> FaceTime Audio
              </button>
            </div>
          </div>
        ) : callState === 'ringing' ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-tr ${activeContact.gradient} flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-white/30 animate-pulse`}>
              {activeContact.avatar}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white">{activeContact.name}</h2>
              <p className="text-xs text-emerald-400 font-mono animate-pulse">FaceTime Ringing...</p>
            </div>
            <button 
              onClick={handleEndCall}
              className="p-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-2xl transition-transform active:scale-95"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        ) : (
          /* Active Call Screen with Speech & Video Animation */
          <div className="flex-1 flex flex-col justify-between p-6 relative">
            {/* Background Stream Render */}
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-0">
              {callType === 'video' && !isVideoOff ? (
                useWebcam ? (
                  <video ref={videoRef} className="w-full h-full object-cover" />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <canvas ref={canvasRef} width={600} height={400} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="relative z-10 text-center space-y-3">
                      <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-tr ${activeContact.gradient} flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-4 ring-emerald-500/60 animate-pulse`}>
                        {activeContact.avatar}
                      </div>
                      <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 max-w-sm text-xs text-emerald-300 font-medium shadow-2xl">
                        "{activeContact.speech}"
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center space-y-4 relative z-10">
                  <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${activeContact.gradient} flex items-center justify-center text-3xl font-bold text-white shadow-2xl`}>
                    {activeContact.avatar}
                  </div>
                  <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 max-w-sm text-xs text-emerald-300 font-medium">
                    "{activeContact.speech}"
                  </div>
                </div>
              )}
            </div>

            {/* Top Bar */}
            <div className="relative z-10 flex justify-between items-center bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/15">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-xs text-white">{activeContact.name}</span>
              </div>
              <span className="font-mono text-xs text-emerald-400 font-bold">{formatTimer(callDuration)}</span>
            </div>

            {/* Bottom Controls */}
            <div className="relative z-10 self-center flex items-center gap-4 bg-black/70 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/20 shadow-2xl">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-rose-500 text-white' : 'bg-white/15 text-white hover:bg-white/25'}`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {callType === 'video' && (
                <button 
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3 rounded-full transition-colors ${isVideoOff ? 'bg-rose-500 text-white' : 'bg-white/15 text-white hover:bg-white/25'}`}
                >
                  {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
              )}

              <button 
                onClick={() => speakContactVoice(activeContact.speech)}
                className="p-3 rounded-full bg-white/15 text-white hover:bg-white/25"
                title="Speak Again"
              >
                <Volume2 size={18} />
              </button>

              <button 
                onClick={handleEndCall}
                className="p-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg transition-transform active:scale-95"
              >
                <PhoneOff size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
