'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Moon, Stars, Clock, Lock, Unlock } from 'lucide-react';
import { useTasks } from '@/lib/store';
import ParentUnlockFlow from './ParentUnlockFlow';

export default function SleepModeOverlay() {
  const { sleepConfig, parentConfig, setManualSleepUnlock } = useTasks();
  const [stars, setStars] = React.useState<{id: number, top: string, left: string, duration: number, delay: number}[]>([]);
  const [showUnlockFlow, setShowUnlockFlow] = React.useState(false);

  React.useEffect(() => {
    const generatedStars = [...Array(20)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0e27] z-[200] flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Animated Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0.2, scale: 0.5 }}
            animate={{ 
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{ 
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay
            }}
            className="absolute text-yellow-200"
            style={{ 
              top: star.top,
              left: star.left
            }}
          >
            <Stars className="w-4 h-4" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 text-center flex flex-col items-center gap-8"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 bg-yellow-100 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(254,240,138,0.3)]"
          >
            <Moon className="w-24 h-24 text-yellow-500 fill-yellow-500" />
          </motion.div>
          <div className="absolute -bottom-4 -right-4 bg-blue-500 p-4 rounded-full border-4 border-[#0a0e27]">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white font-bubblegum tracking-wide">
            Soneca Noturna
          </h1>
          <p className="text-blue-200 text-xl max-w-md">
            O TaskHero está descansando para o dia de amanhã. 
            Hora de dormir e recarregar as energias! 😴
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[30px] border border-white/20 flex items-center gap-4">
          <Clock className="w-8 h-8 text-yellow-400" />
          <div className="text-left">
            <p className="text-blue-300 text-sm uppercase font-bold tracking-widest">Desperta às</p>
            <p className="text-white text-3xl font-bold">{sleepConfig.wakeupTime}</p>
          </div>
        </div>

        <p className="text-white/40 text-sm mt-8 italic">
          O dispositivo será liberado automaticamente no horário de acordar.
        </p>

        <button
          onClick={() => setShowUnlockFlow(true)}
          className="mt-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-6 py-3 rounded-full border border-white/10 transition-all active:scale-95 text-sm font-bold uppercase tracking-widest"
        >
          <Unlock className="w-4 h-4" />
          Liberar Dispositivo (Responsável)
        </button>
      </motion.div>

      {showUnlockFlow && (
        <ParentUnlockFlow
          correctPin={parentConfig.pin || "1234"}
          onSuccess={() => {
            setManualSleepUnlock(true);
            setShowUnlockFlow(false);
          }}
          onCancel={() => setShowUnlockFlow(false)}
        />
      )}

      {/* Decorative Clouds */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none" />
    </div>
  );
}
