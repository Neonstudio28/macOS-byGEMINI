import React, { useState } from 'react';
import { Play, Code, FileCode, Terminal, Sparkles } from 'lucide-react';

const SAMPLES = [
  {
    name: 'liquid_glass.js',
    code: `// ValOS Tahoe Liquid Glass Shader Computation
const glassConfig = {
  blurRadius: 24,
  saturation: 190,
  opacity: 0.18
};

function computeSpecularShimmer(mouseX, mouseY) {
  const intensity = (mouseX + mouseY) / 100;
  return \`radial-gradient(circle at \${mouseX}px \${mouseY}px, rgba(255,255,255,\${intensity}), transparent 60%)\`;
}

console.log("Computed Specular Effect:");
console.log(computeSpecularShimmer(120, 240));`
  },
  {
    name: 'fibonacci.js',
    code: `// Calculate Fibonacci sequence in ValOS
function fibonacci(n) {
  let arr = [0, 1];
  for (let i = 2; i < n; i++) {
    arr[i] = arr[i - 1] + arr[i - 2];
  }
  return arr;
}

console.log("Fibonacci Sequence (first 10 terms):");
console.log(fibonacci(10).join(', '));`
  }
];

export const ValCode = ({ windowData }) => {
  const [code, setCode] = useState(windowData?.fileContent || SAMPLES[0].code);
  const [fileName, setFileName] = useState(windowData?.fileName || SAMPLES[0].name);
  const [outputLogs, setOutputLogs] = useState(['Console ready. Press "Run Code" to execute.']);

  const handleRunCode = () => {
    setOutputLogs(['Executing code...']);
    const logs = [];
    const customConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      warn: (...args) => logs.push(`[WARN] ${args.join(' ')}`),
      error: (...args) => logs.push(`[ERROR] ${args.join(' ')}`)
    };

    try {
      const runFn = new Function('console', code);
      runFn(customConsole);
      setOutputLogs(logs.length > 0 ? logs : ['Code executed successfully with 0 output logs.']);
    } catch (err) {
      setOutputLogs([`[RUNTIME ERROR]: ${err.message}`]);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-100 font-mono text-xs select-none">
      {/* Sidebar Template Files */}
      <div className="w-52 border-r border-white/10 p-3 bg-white/5 backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-3">
            <Code size={16} />
            <span>ValCode IDE</span>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Sample Scripts</div>
          <div className="space-y-1">
            {SAMPLES.map((s) => (
              <button
                key={s.name}
                onClick={() => { setFileName(s.name); setCode(s.code); }}
                className={`w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  fileName === s.name ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30' : 'hover:bg-white/10 text-slate-300'
                }`}
              >
                <FileCode size={14} className="text-cyan-400" />
                <span className="truncate">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleRunCode}
          className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <Play size={14} /> Run Code
        </button>
      </div>

      {/* Code Editor & Console Output */}
      <div className="flex-1 flex flex-col bg-slate-950">
        <div className="h-9 px-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <span className="font-bold text-cyan-300">{fileName}</span>
          <span className="text-[10px] text-slate-400">JavaScript Environment</span>
        </div>

        {/* Text Area Code Editor */}
        <div className="flex-1 p-4 overflow-auto">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-transparent text-slate-100 focus:outline-none resize-none font-mono leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Output Console Pane */}
        <div className="h-36 border-t border-white/10 bg-slate-900/90 p-3 overflow-auto">
          <div className="flex items-center gap-2 text-slate-400 font-bold mb-1 text-[11px]">
            <Terminal size={13} />
            <span>Output Console</span>
          </div>
          <div className="space-y-1">
            {outputLogs.map((log, idx) => (
              <div key={idx} className={`leading-relaxed ${log.includes('ERROR') ? 'text-rose-400' : 'text-emerald-300'}`}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
