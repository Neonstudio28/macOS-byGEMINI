import React from 'react';
import { useOS } from '../../context/OSContext';
import { Bell, X, Sparkles, CheckCheck } from 'lucide-react';

export const NotificationCenter = () => {
  const { notificationCenterOpen, setNotificationCenterOpen, notifications, setNotifications } = useOS();

  if (!notificationCenterOpen) return null;

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div 
      className="fixed top-9 right-3 w-80 rounded-2xl liquid-glass-dark p-4 shadow-2xl z-50 text-slate-100 text-xs border border-white/20 select-none animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
      onMouseLeave={() => setNotificationCenterOpen(false)}
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2 font-bold text-slate-200">
          <Bell size={14} className="text-cyan-400" />
          <span>Notification Center</span>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto space-y-2">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No new notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 relative group">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 text-xs">{n.title}</span>
                <span className="text-[10px] text-slate-500">{n.time}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
              <button 
                onClick={() => handleDismiss(n.id)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
