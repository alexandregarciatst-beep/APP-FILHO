'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, ShieldCheck } from 'lucide-react';

interface PinAuthProps {
  correctPin: string;
  onSuccess: (pin: string) => void;
  onCancel: () => void;
  isSetup?: boolean;
}

export default function PinAuth({ correctPin, onSuccess, onCancel, isSetup = false }: PinAuthProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(isSetup ? 'initial' : 'auth');

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (isSetup) {
        if (step === 'initial') {
          setConfirmPin(pin);
          setPin('');
          setStep('confirm');
        } else {
          if (pin === confirmPin) {
            onSuccess(pin);
          } else {
            setError(true);
            setPin('');
            setStep('initial');
            setConfirmPin('');
          }
        }
      } else {
        if (pin === correctPin) {
          onSuccess(pin);
        } else {
          setError(true);
          setPin('');
          setTimeout(() => setError(false), 500);
        }
      }
    }
  }, [pin, confirmPin, correctPin, isSetup, onSuccess, step]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl border-8 border-purple-500"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            {isSetup ? <ShieldCheck className="text-purple-600" /> : <Lock className="text-purple-600" />}
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bubblegum text-purple-900">
              {isSetup 
                ? (step === 'initial' ? 'CRIAR PIN DE SEGURANÇA' : 'CONFIRME SEU PIN') 
                : 'DIGITE SEU PIN'}
            </h2>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">
              {isSetup ? 'Para proteger as configurações' : 'Acesso do Responsável'}
            </p>
          </div>

          <div className="flex gap-4 justify-center my-4">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-5 h-5 rounded-full border-4 transition-all duration-200 ${
                  pin.length > i 
                    ? 'bg-purple-500 border-purple-500 scale-110' 
                    : 'bg-gray-100 border-gray-200'
                } ${error ? 'border-red-500 animate-shake' : ''}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-16 rounded-2xl bg-gray-50 text-2xl font-bubblegum text-gray-700 hover:bg-gray-100 active:scale-90 transition-all border-2 border-transparent hover:border-purple-200 shadow-sm"
              >
                {num}
              </button>
            ))}
            <button
              onClick={onCancel}
              className="h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 active:scale-90 transition-all border-2 border-transparent"
            >
              <X />
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="h-16 rounded-2xl bg-gray-50 text-2xl font-bubblegum text-gray-700 hover:bg-gray-100 active:scale-90 transition-all border-2 border-transparent hover:border-purple-200 shadow-sm"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="h-16 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all"
            >
              DEL
            </button>
          </div>

          {error && (
            <p className="text-red-500 font-bold text-sm animate-bounce">
              {isSetup ? 'PINs não conferem! Tente de novo.' : 'PIN incorreto!'}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
