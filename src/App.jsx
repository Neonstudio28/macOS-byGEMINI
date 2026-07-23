import React from 'react';
import { useOS, OSProvider } from './context/OSContext';
import { TopMenuBar } from './components/os/TopMenuBar';
import { Desktop } from './components/os/Desktop';
import { Dock } from './components/os/Dock';
import { WindowManager } from './components/os/WindowManager';
import { Spotlight } from './components/os/Spotlight';
import { ControlCenter } from './components/os/ControlCenter';
import { NotificationCenter } from './components/os/NotificationCenter';
import { LockScreen } from './components/os/LockScreen';
import { ShutdownScreen } from './components/os/ShutdownScreen';
import { ValSiri } from './components/os/ValSiri';
import { MissionControl } from './components/os/MissionControl';
import { WidgetPanel } from './components/os/WidgetPanel';
import { BootScreen } from './components/os/BootScreen';
import { ForceQuitModal } from './components/os/ForceQuitModal';
import { StageManager } from './components/os/StageManager';
import { Launchpad } from './components/os/Launchpad';

function AppContent() {
  const { stageManagerEnabled, launchpadOpen, setLaunchpadOpen } = useOS();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans text-white select-none">
      {/* Apple macOS Bootup & Lock Screen */}
      <BootScreen />

      {/* Top Menu Bar */}
      <TopMenuBar />

      {/* Stage Manager Rail */}
      <StageManager enabled={stageManagerEnabled} />

      {/* Desktop Wallpaper & Icons */}
      <Desktop />

      {/* Floating App Windows */}
      <WindowManager />

      {/* Dock */}
      <Dock />

      {/* Overlays & Popovers */}
      <Spotlight />
      <ControlCenter />
      <NotificationCenter />
      <LockScreen />
      <ShutdownScreen />
      <ValSiri />
      <MissionControl />
      <WidgetPanel />
      <ForceQuitModal />
      <Launchpad isOpen={launchpadOpen} onClose={() => setLaunchpadOpen(false)} />
    </div>
  );
}

export function App() {
  return (
    <OSProvider>
      <AppContent />
    </OSProvider>
  );
}

export default App;
