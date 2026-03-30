'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MathLock({ onSuccess, onCancel }: Props) {
  const [problem] = useState(() => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    return { a, b, answer: a * b };
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(input) === problem.answer) {
      onSuccess();
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] w-full max-w-sm p-8 text-center border-8 border-[#D0021B]">
        <div className="flex justify-end mb-2">
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={32} />
          </button>
        </div>
        
        <h2 className="text-3xl font-bubblegum text-[#D0021B] mb-4">ÁREA DO RESPONSÁVEL</h2>
        <p className="text-gray-600 mb-6 font-bold">Resolva o desafio para entrar:</p>
        
        <div className="text-5xl font-bubblegum text-[#4A90E2] mb-8 animate-bounce">
          {problem.a} x {problem.b} = ?
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full p-6 bg-gray-100 rounded-3xl text-3xl text-center font-bubblegum outline-none border-4 transition-all ${
              error ? 'border-[#D0021B] animate-shake' : 'border-transparent focus:border-[#4A90E2]'
            }`}
            placeholder="?"
          />
          <button
            type="submit"
            className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white py-5 rounded-full text-2xl font-bubblegum shadow-lg transition active:scale-95"
          >
            ENTRAR 🛡️
          </button>
        </form>
        
        {error && <p className="text-[#D0021B] mt-4 font-bold">Ops! Tente novamente.</p>}
      </div>
    </div>
  );
}
