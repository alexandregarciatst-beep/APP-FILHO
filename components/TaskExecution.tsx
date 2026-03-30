'use client';

import React, { useState, useEffect } from 'react';
import { Task, LESSONS_LIST } from '@/lib/models';
import { useTasks } from '@/lib/store';
import { Timer, CheckCircle2, ArrowRight, Star, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  task: Task;
  onClose: () => void;
}

export default function TaskExecution({ task, onClose }: Props) {
  const { completeTask } = useTasks();
  const [timeLeft, setTimeLeft] = useState(task.durationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [step, setStep] = useState<'timer' | 'reflection'>('timer');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    if (timeLeft > 0) return;
    setStep('reflection');
  };

  const handleFinish = () => {
    if (!selectedLessonId) return;
    completeTask(task.id, selectedLessonId);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF4500', '#1E90FF', '#32CD32']
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border-8 border-[#FFD700]"
      >
        <div className="bg-[#4A90E2] p-6 text-white text-center">
          <h2 className="text-3xl font-bubblegum">{task.name}</h2>
          <p className="opacity-90">Ganhe {task.points} estrelas! ⭐</p>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'timer' ? (
              <motion.div 
                key="timer"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex flex-col items-center gap-8"
              >
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="#E0E0E0"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="#4A90E2"
                      strokeWidth="12"
                      strokeDasharray="552.92"
                      animate={{ strokeDashoffset: 552.92 * (1 - timeLeft / task.durationSeconds) }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </svg>
                  <span className="text-5xl font-mono font-bold text-[#4A90E2]">
                    {formatTime(timeLeft)}
                  </span>
                </div>

                {!isTimerRunning && timeLeft > 0 ? (
                  <button
                    onClick={() => setIsTimerRunning(true)}
                    className="bg-[#32CD32] hover:bg-[#2EB82E] text-white px-12 py-4 rounded-full text-2xl font-bubblegum shadow-lg transform transition active:scale-95"
                  >
                    INICIAR TAREFA! 🚀
                  </button>
                ) : (
                  <button
                    disabled={timeLeft > 0}
                    onClick={handleComplete}
                    className={`px-12 py-4 rounded-full text-2xl font-bubblegum shadow-lg transform transition active:scale-95 ${
                      timeLeft > 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-[#FFD700] text-[#2C3E50] hover:bg-[#FFC800]'
                    }`}
                  >
                    {timeLeft > 0 ? 'FAZENDO...' : 'CONCLUIR! ✅'}
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="reflection"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <h3 className="text-2xl text-center font-bubblegum text-[#4A90E2]">
                  MURAL DE LIÇÕES: O que você praticou?
                </h3>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full max-h-[400px] overflow-y-auto p-2">
                  {LESSONS_LIST.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-4 transition-all ${
                        selectedLessonId === lesson.id 
                          ? 'bg-[#4A90E2] text-white border-[#FFD700] scale-105 shadow-lg' 
                          : 'bg-white text-gray-600 border-gray-100 hover:border-[#4A90E2]'
                      }`}
                    >
                      <span className="text-4xl mb-1">{lesson.icon}</span>
                      <span className="text-[10px] font-bold uppercase text-center leading-tight">
                        {lesson.label}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  disabled={!selectedLessonId}
                  onClick={handleFinish}
                  className={`w-full py-4 rounded-full text-2xl font-bubblegum shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2 ${
                    !selectedLessonId 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#32CD32] text-white hover:bg-[#2EB82E]'
                  }`}
                >
                  SALVAR LIÇÃO <Star className="fill-white" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
