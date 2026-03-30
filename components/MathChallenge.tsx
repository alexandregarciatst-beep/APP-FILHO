'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator } from 'lucide-react';

interface MathChallengeProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MathChallenge({ onSuccess, onCancel }: MathChallengeProps) {
  const [challenge, setChallenge] = useState({ a: 0, b: 0, op: '+', result: 0 });
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const generateChallenge = React.useCallback(() => {
    const ops = ['+', '-', 'x'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, result;

    if (op === 'x') {
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      result = a * b;
    } else if (op === '+') {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      result = a + b;
    } else {
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * 19) + 1;
      result = a - b;
    }

    setChallenge({ a, b, op, result });
    setAnswer('');
    setError(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateChallenge();
    }, 0);
    return () => clearTimeout(timer);
  }, [generateChallenge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer) === challenge.result) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl border-8 border-yellow-400"
      >
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Calculator className="w-10 h-10 text-blue-600" />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2 font-bubblegum">Área do Responsável</h2>
            <p className="text-gray-600">Resolva o desafio para provar que você é um adulto!</p>
          </div>

          <div className={`text-5xl font-bold p-6 bg-gray-100 rounded-3xl border-4 ${error ? 'border-red-500 animate-shake' : 'border-blue-200'}`}>
            {challenge.a} {challenge.op === 'x' ? '×' : challenge.op} {challenge.b} = ?
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Sua resposta..."
              autoFocus
              className="w-full text-center text-3xl p-4 rounded-2xl border-4 border-blue-100 focus:border-blue-400 outline-none transition-all"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="p-4 rounded-2xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="p-4 rounded-2xl bg-blue-500 text-white font-bold shadow-lg hover:bg-blue-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
