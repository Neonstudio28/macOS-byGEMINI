import React from 'react';
import { useOS } from '../../context/OSContext';
import { WindowFrame } from './WindowFrame';
import { ValFinder } from '../../apps/ValFinder';
import { ValSafari } from '../../apps/ValSafari';
import { ValTerminal } from '../../apps/ValTerminal';
import { ValNotes } from '../../apps/ValNotes';
import { ValMusic } from '../../apps/ValMusic';
import { ValPhotos } from '../../apps/ValPhotos';
import { ValSettings } from '../../apps/ValSettings';
import { ValCalculator } from '../../apps/ValCalculator';
import { ValCode } from '../../apps/ValCode';
import { ValArcade } from '../../apps/ValArcade';
import { ValMessages } from '../../apps/ValMessages';
import { ValMail } from '../../apps/ValMail';
import { ValAppStore } from '../../apps/ValAppStore';
import { ValDiskUtility } from '../../apps/ValDiskUtility';
import { ValActivityMonitor } from '../../apps/ValActivityMonitor';
import { ValFaceTime } from '../../apps/ValFaceTime';
import { ValContacts } from '../../apps/ValContacts';
import { ValChess } from '../../apps/ValChess';

export const WindowManager = () => {
  const { windows } = useOS();

  const renderAppContent = (win) => {
    switch (win.appKey) {
      case 'finder': return <ValFinder windowData={win.data} />;
      case 'safari': return <ValSafari />;
      case 'terminal': return <ValTerminal />;
      case 'notes': return <ValNotes windowData={win.data} />;
      case 'music': return <ValMusic />;
      case 'photos': return <ValPhotos windowData={win.data} />;
      case 'settings': return <ValSettings />;
      case 'calculator': return <ValCalculator />;
      case 'code': return <ValCode windowData={win.data} />;
      case 'arcade': return <ValArcade />;
      case 'messages': return <ValMessages />;
      case 'mail': return <ValMail />;
      case 'appstore': return <ValAppStore />;
      case 'diskutility': return <ValDiskUtility />;
      case 'activitymonitor': return <ValActivityMonitor />;
      case 'facetime': return <ValFaceTime />;
      case 'contacts': return <ValContacts />;
      case 'chess': return <ValChess />;
      default: return <div className="p-4 text-xs text-slate-400">Unknown Application</div>;
    }
  };

  return (
    <>
      {windows.map((win) => (
        <WindowFrame key={win.id} windowObj={win}>
          {renderAppContent(win)}
        </WindowFrame>
      ))}
    </>
  );
};
