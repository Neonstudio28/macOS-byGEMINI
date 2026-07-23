import React, { useState } from 'react';

export const ValCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNum = (num) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op) => {
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleEqual = () => {
    try {
      const full = (equation + display).replace(/×/g, '*').replace(/÷/g, '/');
      const res = Function(`'use strict'; return (${full})`)();
      setDisplay(String(res));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1C1C1E] p-3 select-none font-sans text-white">
      {/* Screen Display */}
      <div className="flex-1 p-3 flex flex-col justify-end items-end mb-2">
        <div className="text-xs text-white/50 font-mono h-4">{equation}</div>
        <div className="text-4xl font-light text-white truncate max-w-full tracking-tight">{display}</div>
      </div>

      {/* Grid Buttons */}
      <div className="grid grid-cols-4 gap-2 text-base font-medium">
        <button onClick={handleClear} className="w-14 h-14 rounded-full bg-[#A5A5A5] text-black font-semibold hover:bg-white active:scale-95 transition-all flex items-center justify-center mx-auto">AC</button>
        <button onClick={() => setDisplay(String(-parseFloat(display)))} className="w-14 h-14 rounded-full bg-[#A5A5A5] text-black font-semibold hover:bg-white active:scale-95 transition-all flex items-center justify-center mx-auto">+/-</button>
        <button onClick={() => setDisplay(String(parseFloat(display) / 100))} className="w-14 h-14 rounded-full bg-[#A5A5A5] text-black font-semibold hover:bg-white active:scale-95 transition-all flex items-center justify-center mx-auto">%</button>
        <button onClick={() => handleOp('÷')} className="w-14 h-14 rounded-full bg-[#FF9F0A] text-white font-bold hover:bg-[#ffb340] active:scale-95 transition-all flex items-center justify-center mx-auto text-xl">÷</button>

        {['7','8','9'].map(n => <button key={n} onClick={() => handleNum(n)} className="w-14 h-14 rounded-full bg-[#333333] text-white hover:bg-[#444444] active:scale-95 transition-all flex items-center justify-center mx-auto">{n}</button>)}
        <button onClick={() => handleOp('×')} className="w-14 h-14 rounded-full bg-[#FF9F0A] text-white font-bold hover:bg-[#ffb340] active:scale-95 transition-all flex items-center justify-center mx-auto text-xl">×</button>

        {['4','5','6'].map(n => <button key={n} onClick={() => handleNum(n)} className="w-14 h-14 rounded-full bg-[#333333] text-white hover:bg-[#444444] active:scale-95 transition-all flex items-center justify-center mx-auto">{n}</button>)}
        <button onClick={() => handleOp('-')} className="w-14 h-14 rounded-full bg-[#FF9F0A] text-white font-bold hover:bg-[#ffb340] active:scale-95 transition-all flex items-center justify-center mx-auto text-xl">-</button>

        {['1','2','3'].map(n => <button key={n} onClick={() => handleNum(n)} className="w-14 h-14 rounded-full bg-[#333333] text-white hover:bg-[#444444] active:scale-95 transition-all flex items-center justify-center mx-auto">{n}</button>)}
        <button onClick={() => handleOp('+')} className="w-14 h-14 rounded-full bg-[#FF9F0A] text-white font-bold hover:bg-[#ffb340] active:scale-95 transition-all flex items-center justify-center mx-auto text-xl">+</button>

        <button onClick={() => handleNum('0')} className="col-span-2 h-14 rounded-full bg-[#333333] text-white hover:bg-[#444444] active:scale-95 transition-all flex items-center pl-6">0</button>
        <button onClick={() => handleNum('.')} className="w-14 h-14 rounded-full bg-[#333333] text-white hover:bg-[#444444] active:scale-95 transition-all flex items-center justify-center mx-auto">.</button>
        <button onClick={handleEqual} className="w-14 h-14 rounded-full bg-[#FF9F0A] text-white font-bold hover:bg-[#ffb340] active:scale-95 transition-all flex items-center justify-center mx-auto text-xl">=</button>
      </div>
    </div>
  );
};
