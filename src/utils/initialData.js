// Initial Virtual File System & State for macOS 26 Tahoe

export const INITIAL_FILESYSTEM = {
  id: 'root',
  name: '/',
  type: 'folder',
  children: [
    {
      id: 'desktop',
      name: 'Desktop',
      type: 'folder',
      children: [
        {
          id: 'welcome-txt',
          name: 'Welcome to macOS Tahoe.txt',
          type: 'file',
          fileType: 'text',
          content: `=========================================
MACOS 26 TAHOE - LIQUID GLASS EDITION
=========================================

Welcome to macOS 26 Tahoe!

Key Features:
• Real SVG Refraction Optics (Optical Liquid Blur)
• Authentic Apple 3D App Icon Suite
• Apple macOS Menu Bar & Traffic Light Window Physics
• Siri Conversational Voice & AI Pod Assistant
• Mission Control, Stage Manager & Glass Widgets Drawer
• 20+ Built-in macOS Apps (Finder, Safari, FaceTime, iMessage, Mail, Contacts, App Store, Disk Utility, Activity Monitor, Terminal, Notes, Music, Photos, System Settings, Calculator, Xcode, Arcade Pong, Chess, Clock, Weather)

Shortcuts:
• Cmd+Space — Spotlight Search
• Cmd+Option+Esc — Force Quit
• F4 — Widget Drawer
• F6 — Launchpad
• Cmd+L — Lock Screen`
        },
        {
          id: 'tahoe-roadmap',
          name: 'Tahoe System Spec.md',
          type: 'file',
          fileType: 'text',
          content: `# macOS 26 Tahoe Architecture Spec

- Kernel: Darwin 26.0.0 (x86_64 / arm64)
- Core Optics: SVG Optical Displacement & Refraction Shaders
- Window Manager: Stacking z-index engine with Genie minimize
- Audio Engine: Synthesizer Web Audio API for Chimes & Music`
        },
        {
          id: 'sample-script',
          name: 'liquid_glass.js',
          type: 'file',
          fileType: 'code',
          content: `// macOS 26 Tahoe Glass Engine
console.log("Initializing macOS Tahoe Liquid Glass...");

function applyRefractionFilter(intensity) {
  return \`backdrop-filter: url(#lg-refraction) blur(\${intensity * 12}px) saturate(190%);\`;
}

console.log(applyRefractionFilter(2.5));`
        }
      ]
    },
    {
      id: 'documents',
      name: 'Documents',
      type: 'folder',
      children: [
        {
          id: 'project-ideas',
          name: 'Apple Human Interface Guidelines.txt',
          type: 'file',
          fileType: 'text',
          content: 'Translucent materials, exact 24px menu bar, rounded 16px window corners, 12px traffic lights.'
        }
      ]
    },
    {
      id: 'downloads',
      name: 'Downloads',
      type: 'folder',
      children: [
        {
          id: 'tahoe-wallpaper-hd',
          name: 'Tahoe Sunset.jpg',
          type: 'file',
          fileType: 'image',
          url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'
        }
      ]
    },
    {
      id: 'pictures',
      name: 'Pictures',
      type: 'folder',
      children: [
        {
          id: 'pic-1',
          name: 'Aurora Night.jpg',
          type: 'file',
          fileType: 'image',
          url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=80'
        },
        {
          id: 'pic-2',
          name: 'Emerald Glass Wave.jpg',
          type: 'file',
          fileType: 'image',
          url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=80'
        }
      ]
    },
    {
      id: 'trash',
      name: 'Trash',
      type: 'folder',
      children: []
    }
  ]
};

export const DEFAULT_WALLPAPERS = [
  {
    id: 'mac-sonoma-nature',
    name: 'Sonoma Horizon (Default)',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90'
  },
  {
    id: 'tahoe-blue-lake',
    name: 'Lake Tahoe Alpine Nature',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=90'
  },
  {
    id: 'sequoia-forest',
    name: 'Sequoia Misty Pines',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=90'
  },
  {
    id: 'yosemite-valley',
    name: 'Yosemite Sunset Peaks',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2400&q=90'
  },
  {
    id: 'tahoe-liquid',
    name: 'Tahoe Liquid Dark Gradient',
    type: 'gradient',
    bgStyle: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #31103f 60%, #030712 100%)'
  }
];

export const APP_CONFIGS = {
  finder: { id: 'finder', title: 'Finder', icon: 'Folder', width: 850, height: 550 },
  safari: { id: 'safari', title: 'Safari', icon: 'Compass', width: 920, height: 600 },
  messages: { id: 'messages', title: 'Messages', icon: 'MessageSquare', width: 840, height: 560 },
  mail: { id: 'mail', title: 'Mail', icon: 'Mail', width: 880, height: 560 },
  facetime: { id: 'facetime', title: 'FaceTime', icon: 'Video', width: 720, height: 480 },
  contacts: { id: 'contacts', title: 'Contacts', icon: 'Users', width: 700, height: 500 },
  appstore: { id: 'appstore', title: 'App Store', icon: 'Store', width: 940, height: 620 },
  diskutility: { id: 'diskutility', title: 'Disk Utility', icon: 'HardDrive', width: 800, height: 520 },
  activitymonitor: { id: 'activitymonitor', title: 'Activity Monitor', icon: 'Activity', width: 820, height: 540 },
  terminal: { id: 'terminal', title: 'Terminal', icon: 'Terminal', width: 720, height: 460 },
  notes: { id: 'notes', title: 'Notes', icon: 'FileText', width: 800, height: 520 },
  music: { id: 'music', title: 'Music', icon: 'Music', width: 840, height: 540 },
  photos: { id: 'photos', title: 'Photos', icon: 'Image', width: 880, height: 560 },
  settings: { id: 'settings', title: 'System Settings', icon: 'Sliders', width: 840, height: 580 },
  calculator: { id: 'calculator', title: 'Calculator', icon: 'Calculator', width: 340, height: 480 },
  code: { id: 'code', title: 'Xcode', icon: 'Code', width: 880, height: 580 },
  arcade: { id: 'arcade', title: 'Arcade Pong', icon: 'Gamepad2', width: 780, height: 560 },
  chess: { id: 'chess', title: 'Chess', icon: 'Chess', width: 960, height: 640 }
};
