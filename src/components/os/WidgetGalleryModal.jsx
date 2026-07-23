import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  X, 
  Plus, 
  Clock, 
  Sun, 
  Battery, 
  Calendar, 
  Activity, 
  TrendingUp, 
  CheckSquare, 
  Image as ImageIcon,
  Sparkles,
  Grid
} from 'lucide-react';
import { sounds } from '../../utils/soundEngine';

export const WIDGET_CATALOG = [
  {
    type: 'clock',
    title: 'Analog Clock',
    category: 'Clock',
    size: 'small',
    desc: 'View current time with analog clock hands.'
  },
  {
    type: 'weather',
    title: 'Weather Forecast',
    category: 'Weather',
    size: 'medium',
    desc: 'Real-time temperature and 3-day forecast.'
  },
  {
    type: 'battery',
    title: 'Batteries',
    category: 'System',
    size: 'small',
    desc: 'Battery levels for Mac and Bluetooth accessories.'
  },
  {
    type: 'calendar',
    title: 'Calendar Month',
    category: 'Calendar',
    size: 'medium',
    desc: 'Month calendar grid and upcoming events.'
  },
  {
    type: 'reminders',
    title: 'Reminders Checklist',
    category: 'Productivity',
    size: 'medium',
    desc: 'Interactive task checklist with completion checkboxes.'
  },
  {
    type: 'stocks',
    title: 'Stocks Ticker',
    category: 'Finance',
    size: 'medium',
    desc: 'Live market prices for AAPL, GOOGL, MSFT.'
  },
  {
    type: 'activity',
    title: 'CPU Performance',
    category: 'System',
    size: 'small',
    desc: 'Live CPU load and memory usage gauge.'
  }
];

export const WidgetGalleryModal = ({ isOpen, onClose, onAddWidget }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Clock', 'Weather', 'System', 'Calendar', 'Productivity', 'Finance'];

  const filtered = selectedCategory === 'All' 
    ? WIDGET_CATALOG 
    : WIDGET_CATALOG.filter(w => w.category === selectedCategory);

  const handleSelectWidget = (widget) => {
    sounds.playClick();
    onAddWidget(widget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9600] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 select-none font-sans text-xs text-white">
      <div className="w-[680px] max-h-[80vh] rounded-3xl macos-glass p-6 border border-white/20 shadow-2xl flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Sparkles size={20} className="text-cyan-400" />
            <span>macOS Desktop Widget Gallery</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/15 rounded-full text-white/60 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto border-b border-white/10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat ? 'bg-[#007AFF] text-white shadow-md' : 'bg-white/10 hover:bg-white/20 text-white/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Widget Grid Catalog */}
        <div className="flex-1 my-4 overflow-auto grid grid-cols-2 gap-4 pr-1">
          {filtered.map(widget => (
            <div 
              key={widget.type}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#007AFF]/60 flex flex-col justify-between space-y-3 transition-all hover:bg-white/10 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-cyan-300">{widget.title}</h4>
                  <span className="text-[10px] text-white/40 uppercase font-mono">{widget.size} • {widget.category}</span>
                </div>
                <button 
                  onClick={() => handleSelectWidget(widget)}
                  className="p-2 rounded-full bg-[#007AFF] text-white hover:bg-blue-600 shadow-md transition-transform group-hover:scale-110"
                  title="Add to Desktop"
                >
                  <Plus size={16} />
                </button>
              </div>

              <p className="text-white/60 text-[11px] leading-relaxed">{widget.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10 text-white/40 text-[11px]">
          <span>Drag widgets anywhere on your desktop grid.</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
