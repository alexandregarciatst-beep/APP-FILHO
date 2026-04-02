'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Delete } from 'lucide-react';

interface PinAuthProps {
  correctPin: string;
  onSuccess: (pin: string) => void;
  onCancel: () => void;
  isSetup?: boolean;
}

export default function PinAuth({ correctPin, onSuccess, onCancel, isSetup = false }: PinAuthProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length >= 4 && pin.length <= 6) {
      if (isSetup) {
        // In setup mode, we wait for the user to confirm
      } else if (pin === correctPin) {
        onSuccess(pin);
      } else if (pin.length === (correctPin?.length || 4)) {
        const timer = setTimeout(() => {
          setError(true);
          setTimeout(() => {
            setError(false);
            setPin('');
          }, 500);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [pin, correctPin, isSetup, onSuccess]);

  const handleConfirmSetup = () => {
    if (pin.length >= 4) {
      onSuccess(pin);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl border-8 border-purple-400"
      >
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-purple-600" />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-purple-900 mb-2 font-bubblegum">
              {isSetup ? 'Criar Senha PIN' : 'Digite seu PIN'}
            </h2>
            <p className="text-gray-600">
              {isSetup ? 'Escolha uma senha de 4 a 6 dígitos' : 'Senha de segurança do responsável'}
            </p>
          </div>

          <div className="flex gap-4 h-16 items-center">
            {[...Array(pin.length)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-purple-600 rounded-full" />
            ))}
            {[...Array(Math.max(0, (isSetup ? 6 : correctPin.length) - pin.length))].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((val, i) => (
              <button
                key={i}
                onClick={() => val === 'del' ? handleDelete() : val !== '' && handleNumberClick(val)}
                className={`h-16 rounded-2xl text-2xl font-bold transition-all active:scale-95 ${
                  val === '' ? 'invisible' :
                  val === 'del' ? 'bg-red-100 text-red-600' : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                }`}
              >
                {val === 'del' ? <Delete className="mx-auto" /> : val}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              onClick={onCancel}
              className="p-4 rounded-2xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            {isSetup ? (
              <button
                onClick={handleConfirmSetup}
                disabled={pin.length < 4}
                className="p-4 rounded-2xl bg-purple-500 text-white font-bold shadow-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                Salvar PIN
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
