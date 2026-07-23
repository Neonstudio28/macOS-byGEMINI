import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../context/OSContext';

export const ValTerminal = () => {
  const { filesystem, findNodeById, createFSItem, deleteFSItem, openApp } = useOS();
  const [currentFolderId, setCurrentFolderId] = useState('desktop');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Last login: Wed Jul 22 19:44:00 2026 on ttys000' },
    { type: 'system', content: 'ValOS Tahoe zsh shell v26.0 (x86_64-apple-darwin)' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const bottomRef = useRef(null);

  const currentFolder = findNodeById(filesystem, currentFolderId) || findNodeById(filesystem, 'desktop');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isMatrixMode]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmdLine = inputVal.trim();
    if (!cmdLine) return;

    const newHistory = [...history, { type: 'input', content: `valuser@ValOS-Tahoe ${currentFolder.name} % ${cmdLine}` }];
    const parts = cmdLine.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          content: `valos zsh commands:
  ls           - list directory contents
  cd <dir>     - change directory
  cat <file>   - print file contents
  mkdir <name> - create folder
  touch <name> - create empty file
  rm <name>    - remove file
  neofetch     - system information
  matrix       - toggle digital matrix rain
  calc <expr>  - math evaluation
  open <app>   - launch native macOS app
  clear        - clear screen
  whoami       - current user`
        });
        break;

      case 'ls':
        const items = (currentFolder.children || []).map(c => c.type === 'folder' ? `${c.name}/` : c.name).join('   ');
        newHistory.push({ type: 'output', content: items || '(empty directory)' });
        break;

      case 'cd':
        if (!args || args === '~' || args === '..') {
          setCurrentFolderId('desktop');
          newHistory.push({ type: 'output', content: '~/Desktop' });
        } else {
          const target = (currentFolder.children || []).find(c => c.type === 'folder' && c.name.toLowerCase() === args.toLowerCase());
          if (target) {
            setCurrentFolderId(target.id);
            newHistory.push({ type: 'output', content: `~/Desktop/${target.name}` });
          } else {
            newHistory.push({ type: 'error', content: `cd: no such file or directory: ${args}` });
          }
        }
        break;

      case 'cat':
        if (!args) {
          newHistory.push({ type: 'error', content: 'cat: missing filename' });
        } else {
          const file = (currentFolder.children || []).find(c => c.type === 'file' && c.name.toLowerCase() === args.toLowerCase());
          if (file) {
            newHistory.push({ type: 'output', content: file.content || '(empty file)' });
          } else {
            newHistory.push({ type: 'error', content: `cat: ${args}: No such file or directory` });
          }
        }
        break;

      case 'mkdir':
        if (!args) {
          newHistory.push({ type: 'error', content: 'mkdir: missing directory name' });
        } else {
          createFSItem(currentFolder.id, args, 'folder');
          newHistory.push({ type: 'output', content: `created directory ${args}` });
        }
        break;

      case 'touch':
        if (!args) {
          newHistory.push({ type: 'error', content: 'touch: missing file name' });
        } else {
          createFSItem(currentFolder.id, args, 'file', 'text', `Created on ${new Date().toLocaleString()}`);
          newHistory.push({ type: 'output', content: `created file ${args}` });
        }
        break;

      case 'rm':
        if (!args) {
          newHistory.push({ type: 'error', content: 'rm: missing argument' });
        } else {
          const target = (currentFolder.children || []).find(c => c.name.toLowerCase() === args.toLowerCase());
          if (target) {
            deleteFSItem(target.id);
            newHistory.push({ type: 'output', content: `removed ${args}` });
          } else {
            newHistory.push({ type: 'error', content: `rm: ${args}: No such file or directory` });
          }
        }
        break;

      case 'neofetch':
        newHistory.push({
          type: 'neofetch',
          content: `
               .:'        valuser@ValOS-Tahoe
           __ :'__        -------------------
        .'\`  \`'  \`'.      OS: macOS 26 Tahoe x86_64
       /   .---.   \\     Host: Apple Mac Studio M4 Max
      /   /     \\   \\    Kernel: 26.0.0-tahoe-darwin
     |   |       |   |   Uptime: 6 hours, 42 mins
      \\   \\     /   /    Shell: zsh 5.9 (x86_64-apple-darwin)
       '._ '---' _.'     WM: Tahoe Window Manager
          \`'---'\`        Theme: Liquid Glass Dark
                         Terminal: ValTerminal 26
                         Memory: 32 GB LPDDR5X
`
        });
        break;

      case 'matrix':
        setIsMatrixMode(!isMatrixMode);
        newHistory.push({ type: 'output', content: isMatrixMode ? 'Matrix disabled.' : 'Digital Rain matrix activated.' });
        break;

      case 'calc':
        try {
          const safeExpr = args.replace(/[^0-9+\-*/().]/g, '');
          const res = Function(`'use strict'; return (${safeExpr})`)();
          newHistory.push({ type: 'output', content: `${args} = ${res}` });
        } catch (err) {
          newHistory.push({ type: 'error', content: 'calc: invalid expression' });
        }
        break;

      case 'open':
        if (args) {
          openApp(args.toLowerCase());
          newHistory.push({ type: 'output', content: `Launching ${args}...` });
        } else {
          newHistory.push({ type: 'error', content: 'open: specify app key' });
        }
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'whoami':
        newHistory.push({ type: 'output', content: 'valuser' });
        break;

      default:
        newHistory.push({ type: 'error', content: `zsh: command not found: ${cmd}` });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className={`h-full w-full font-mono text-[12px] p-4 overflow-auto flex flex-col justify-between select-text ${
      isMatrixMode ? 'bg-black text-green-400 matrix-glow' : 'bg-[#1E1E1E] text-white/90'
    }`}>
      <div className="space-y-1 z-10">
        {history.map((h, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {h.type === 'input' && <span className="text-[#007AFF] font-semibold">{h.content}</span>}
            {h.type === 'output' && <span className="text-white/80">{h.content}</span>}
            {h.type === 'error' && <span className="text-rose-400">{h.content}</span>}
            {h.type === 'system' && <span className="text-white/40 italic">{h.content}</span>}
            {h.type === 'neofetch' && <span className="text-cyan-300 font-mono font-semibold">{h.content}</span>}
          </div>
        ))}

        {/* Zsh Input Prompt */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
          <span className="text-[#30D158] font-bold">valuser@ValOS-Tahoe</span>
          <span className="text-[#0A84FF] font-semibold">{currentFolder.name} %</span>
          <input 
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-white focus:outline-none caret-[#0A84FF] font-mono"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
