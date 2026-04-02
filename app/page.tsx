'use client';

import React, { useState, useEffect } from 'react';
import { useTasks } from '@/lib/store';
import { Task } from '@/lib/models';
import TaskExecution from '@/components/TaskExecution';
import { Settings, Lock, Unlock, Star, CheckCircle2, Play, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { isSameDay, parseISO } from 'date-fns';

import ParentUnlockFlow from '@/components/ParentUnlockFlow';
import SleepModeOverlay from '@/components/SleepModeOverlay';
import Shop from '@/components/Shop';

export default function Dashboard() {
  const { dailyTasks, stats, isDailyComplete, tasks, isSleepMode, parentConfig } = useTasks();
  const [executingTask, setExecutingTask] = useState<Task | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showUnlockFlow, setShowUnlockFlow] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  if (!mounted) return null;

  const handleAdminAccess = () => {
    setShowUnlockFlow(true);
  };

  const handleUnlockSuccess = () => {
    setShowUnlockFlow(false);
    router.push('/admin');
  };

  const isTaskDone = (task: Task) => {
    if (!task.completedAt) return false;
    return isSameDay(parseISO(task.completedAt), new Date());
  };

  return (
    <>
      {isSleepMode && <SleepModeOverlay />}
      
      <main className="min-h-screen p-6 flex flex-col items-center gap-8 max-w-2xl mx-auto">
        {/* Header */}
        <header className="w-full flex justify-between items-center bg-white p-6 rounded-[32px] shadow-lg border-4 border-[#4A90E2]">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFD700] p-2 rounded-full shadow-inner">
              <Star className="text-[#D0021B] fill-[#D0021B] w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bubblegum text-[#4A90E2]">TaskHero Ultra</h1>
              <p className="text-sm font-bold text-gray-500">PONTOS: {stats.totalPoints}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowShop(true)}
              className="p-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition active:scale-90 shadow-sm border-2 border-purple-200"
            >
              <ShoppingBag size={24} />
            </button>
            <button 
              onClick={handleAdminAccess}
              className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition active:scale-90 shadow-sm border-2 border-gray-200"
            >
              <Settings size={24} />
            </button>
          </div>
        </header>

        {/* Auth Modals */}
        {showUnlockFlow && (
          <ParentUnlockFlow 
            correctPin={parentConfig.pin}
            onSuccess={handleUnlockSuccess}
            onCancel={() => setShowUnlockFlow(false)}
          />
        )}
        {showShop && (
          <Shop onClose={() => setShowShop(false)} />
        )}

        {/* Daily Status */}
        <div className="w-full text-center">
          <h2 className="text-3xl font-bubblegum text-[#2C3E50] mb-2">
            {isDailyComplete ? "UAU! VOCÊ CONSEGUIU! 🎉" : "TAREFAS DE HOJE 📝"}
          </h2>
          <p className="text-gray-600 font-medium">
            {isDailyComplete 
              ? "Todas as missões foram cumpridas com sucesso!" 
              : "Complete todas as missões para liberar o celular."}
          </p>
        </div>

        {/* Task List */}
        <div className="w-full flex flex-col gap-6">
          {tasks.length === 0 ? (
            <div className="bg-white p-12 rounded-[40px] border-4 border-dashed border-gray-300 text-center shadow-inner">
              <p className="text-2xl text-gray-400 font-bubblegum text-[#4A90E2]">Nenhuma missão cadastrada! 🛡️</p>
              <p className="text-sm text-gray-400 mt-2">Peça para o papai ou a mamãe adicionar missões no painel.</p>
            </div>
          ) : dailyTasks.length === 0 ? (
            <div className="bg-white p-12 rounded-[40px] border-4 border-dashed border-gray-300 text-center shadow-inner">
              <p className="text-2xl text-gray-400 font-bubblegum text-[#32CD32]">Nenhuma missão para hoje! 🏖️</p>
              <p className="text-sm text-gray-400 mt-2">Aproveite seu tempo livre!</p>
            </div>
          ) : (
            dailyTasks.map((task, index) => {
              const done = isTaskDone(task);
              return (
                <motion.div
                  key={task.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden bg-white p-6 rounded-[32px] border-4 transition-all flex items-center justify-between gap-4 shadow-[0_8px_0_0_rgba(0,0,0,0.05)] ${
                    done ? 'border-[#32CD32] opacity-80' : 'border-[#4A90E2]'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-4xl shadow-inner border-2 ${
                      done ? 'bg-[#32CD32]/20 border-[#32CD32]/30' : 'bg-[#4A90E2]/10 border-[#4A90E2]/20'
                    }`}>
                      {task.icon || '🎯'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bubblegum text-[#2C3E50] leading-tight">{task.name}</h3>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-400 mt-1">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                          ⏱️ {Math.floor(task.durationSeconds / 60)} min
                        </span>
                        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          ⭐ {task.points} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {done ? (
                    <div className="bg-[#32CD32] text-white p-3 rounded-full shadow-lg">
                      <CheckCircle2 size={32} />
                    </div>
                  ) : (
                    <button
                      onClick={() => setExecutingTask(task)}
                      className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-8 py-3 rounded-full font-bubblegum text-xl shadow-[0_6px_0_0_#2C5E9E] flex items-center gap-2 transition-all active:translate-y-[4px] active:shadow-none"
                    >
                      INICIAR <Play size={20} fill="white" />
                    </button>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Unlock Button */}
        <AnimatePresence>
          {isDailyComplete && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="w-full mt-8"
            >
              <button 
                onClick={() => alert("CELULAR LIBERADO! BOM DIVERTIMENTO! 🎮")}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFC800] hover:to-[#FF8C00] text-[#2C3E50] py-8 rounded-[40px] text-3xl font-bubblegum shadow-[0_10px_0_#B8860B] border-4 border-white flex flex-col items-center gap-2 transition-all active:translate-y-2 active:shadow-none"
              >
                <Unlock size={48} className="mb-2" />
                CELULAR LIBERADO!
                <span className="text-lg opacity-80">BOM DIVERTIMENTO!</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Execution Modal */}
        {executingTask && (
          <TaskExecution 
            task={executingTask} 
            onClose={() => setExecutingTask(null)} 
          />
        )}

        {/* Footer Info */}
        <footer className="mt-auto py-8 text-center text-gray-400 font-bold text-sm">
          <p>TASKHERO ULTRA © 2026</p>
          <p className="mt-1">CAMADA DE RESPONSABILIDADE ATIVA 🛡️</p>
        </footer>
      </main>
    </>
  );
}
