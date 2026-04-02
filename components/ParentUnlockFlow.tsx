'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Lock, ShieldAlert, X, Timer } from 'lucide-react';

interface ParentUnlockFlowProps {
  correctPin: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type Step = 'math' | 'pin' | 'cooldown';

export default function ParentUnlockFlow({ correctPin, onSuccess, onCancel }: ParentUnlockFlowProps) {
  // Generate Math Problem
  const generateMathData = useCallback(() => {
    const ops = ['+', 'x'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, result;
    if (op === 'x') {
      a = Math.floor(Math.random() * 8) + 2;
      b = Math.floor(Math.random() * 8) + 2;
      result = a * b;
    } else {
      a = Math.floor(Math.random() * 40) + 10;
      b = Math.floor(Math.random() * 40) + 10;
      result = a + b;
    }
    return { a, b, op, result };
  }, []);

  const [step, setStep] = useState<Step>('math');
  const [mathProblem, setMathProblem] = useState(() => generateMathData());
  const [mathInput, setMathInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [error, setError] = useState(false);

  const generateMath = useCallback(() => {
    setMathProblem(generateMathData());
    setMathInput('');
    setError(false);
  }, [generateMathData]);

  // Cooldown Timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setStep('math');
            setAttempts(0);
            setMathProblem(generateMathData());
            setMathInput('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownTime, generateMathData]);

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathInput) === mathProblem.result) {
      setStep('pin');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setMathInput('');
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === correctPin) {
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(true);
      setPinInput('');
      setTimeout(() => setError(false), 500);

      if (newAttempts >= 3) {
        setStep('cooldown');
        setCooldownTime(30); // 30 seconds lockout
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'math' && (
          <motion.div
            key="math"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl border-8 border-blue-500"
          >
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Calculator className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bubblegum text-blue-900">Desafio de Adulto</h2>
                <p className="text-gray-500 font-bold">Resolva para continuar</p>
              </div>
              <div className={`text-5xl font-bubblegum p-6 bg-gray-50 rounded-3xl border-4 w-full ${error ? 'border-red-500 animate-shake' : 'border-blue-100'}`}>
                {mathProblem.a} {mathProblem.op === 'x' ? '×' : '+'} {mathProblem.b} = ?
              </div>
              <form onSubmit={handleMathSubmit} className="w-full space-y-4">
                <input
                  type="number"
                  value={mathInput}
                  onChange={(e) => setMathInput(e.target.value)}
                  placeholder="?"
                  autoFocus
                  className="w-full text-center text-4xl p-6 rounded-3xl border-4 border-gray-100 focus:border-blue-500 outline-none transition-all font-bubblegum"
                />
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={onCancel} className="p-4 rounded-2xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-colors">CANCELAR</button>
                  <button type="submit" className="p-4 rounded-2xl bg-blue-500 text-white font-bold shadow-lg hover:bg-blue-600 transition-colors">PRÓXIMO</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'pin' && (
          <motion.div
            key="pin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl border-8 border-purple-500"
          >
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                <Lock className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bubblegum text-purple-900">PIN do Responsável</h2>
                <p className="text-gray-500 font-bold">Digite sua senha de segurança</p>
              </div>
              <div className="flex gap-2 justify-center">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border-2 border-purple-200 ${pinInput.length > i ? 'bg-purple-500' : 'bg-gray-100'}`} />
                ))}
              </div>
              <form onSubmit={handlePinSubmit} className="w-full space-y-6">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="PIN"
                  autoFocus
                  className={`w-full text-center text-5xl tracking-[1em] p-6 rounded-3xl border-4 outline-none transition-all font-mono ${error ? 'border-red-500 animate-shake' : 'border-purple-100 focus:border-purple-500'}`}
                />
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setStep('math')} className="p-4 rounded-2xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-colors">VOLTAR</button>
                  <button type="submit" className="p-4 rounded-2xl bg-purple-500 text-white font-bold shadow-lg hover:bg-purple-600 transition-colors">DESBLOQUEAR</button>
                </div>
                {attempts > 0 && <p className="text-red-500 font-bold">Tentativas: {attempts}/3</p>}
              </form>
            </div>
          </motion.div>
        )}

        {step === 'cooldown' && (
          <motion.div
            key="cooldown"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border-8 border-red-500 text-center"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <ShieldAlert className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-3xl font-bubblegum text-red-900 uppercase">Acesso Bloqueado</h2>
              <p className="text-gray-600 font-bold">Muitas tentativas incorretas. Aguarde para tentar novamente.</p>
              
              <div className="flex items-center gap-3 text-5xl font-bubblegum text-red-600 bg-red-50 p-8 rounded-3xl border-4 border-red-100 w-full justify-center">
                <Timer className="w-10 h-10" />
                {cooldownTime}s
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
