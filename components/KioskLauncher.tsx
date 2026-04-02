'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Settings, ShoppingBag, Star, CheckCircle2, Play, AlertCircle, Smartphone, ShieldAlert } from 'lucide-react';
import { useTasks } from '@/lib/store';
import { Task } from '@/lib/models';
import TaskExecution from '@/components/TaskExecution';
import PinAuth from '@/components/PinAuth';
import Shop from '@/components/Shop';
import { isSameDay, parseISO } from 'date-fns';

export default function KioskLauncher() {
  const { dailyTasks, stats, isDailyComplete, tasks, parentConfig, updateParentConfig } = useTasks();
  const [executingTask, setExecutingTask] = useState<Task | null>(null);
  const [showPinAuth, setShowPinAuth] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState("");

  // Simulate "Smart Lock" - Detect if window loses focus
  useEffect(() => {
    const handleBlur = () => {
      if (parentConfig.isSetup && !isDailyComplete) {
        setIsLocked(true);
        setLockReason("Tentativa de saída detectada! O JOYLOCK bloqueou o acesso.");
      }
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [parentConfig.isSetup, isDailyComplete]);

  const handleAdminAccess = () => {
    setShowPinAuth(true);
  };

  const handlePinSuccess = () => {
    setShowPinAuth(false);
    setIsLocked(false);
    // In a real app, this would exit the lock task
    alert("Modo Administrador Ativado. Você pode sair do app agora.");
  };

  const isTaskDone = (task: Task) => {
    if (!task.completedAt) return false;
    return isSameDay(parseISO(task.completedAt), new Date());
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] relative overflow-hidden font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-8 gap-4 p-4">
          {Array.from({ length: 64 }).map((_, i) => (
            <Lock key={i} size={48} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 p-6 flex flex-col items-center gap-8 max-w-2xl mx-auto min-h-screen">
        {/* Header */}
        <header className="w-full flex justify-between items-center bg-white p-6 rounded-[32px] shadow-xl border-4 border-blue-500">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
              <Lock className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-blue-900 tracking-tight">JOYLOCK</h1>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Kiosk Mode Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200 flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500 w-5 h-5" />
              <span className="font-black text-yellow-700">{stats.totalPoints}</span>
            </div>
            <button 
              onClick={() => setShowShop(true)}
              className="p-3 bg-purple-100 text-purple-600 rounded-2xl hover:bg-purple-200 transition active:scale-90 shadow-sm border-2 border-purple-200"
            >
              <ShoppingBag size={24} />
            </button>
            <button 
              onClick={handleAdminAccess}
              className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition active:scale-90 shadow-sm border-2 border-gray-200"
            >
              <Settings size={24} />
            </button>
          </div>
        </header>

        {/* Status Banner */}
        <div className={`w-full p-6 rounded-[32px] border-4 flex items-center gap-4 shadow-lg transition-all ${
          isDailyComplete ? 'bg-green-50 border-green-500 text-green-900' : 'bg-blue-50 border-blue-500 text-blue-900'
        }`}>
          <div className={`p-4 rounded-2xl ${isDailyComplete ? 'bg-green-500' : 'bg-blue-500'}`}>
            {isDailyComplete ? <Unlock className="text-white" size={32} /> : <Lock className="text-white" size={32} />}
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              {isDailyComplete ? "Dispositivo Liberado!" : "Modo de Segurança"}
            </h2>
            <p className="text-sm font-medium opacity-70">
              {isDailyComplete 
                ? "Todas as missões concluídas. Divirta-se!" 
                : "Complete as missões abaixo para desbloquear o acesso."}
            </p>
          </div>
        </div>

        {/* Task List */}
        <div className="w-full flex flex-col gap-4">
          {dailyTasks.length === 0 ? (
            <div className="bg-white p-12 rounded-[40px] border-4 border-dashed border-gray-300 text-center shadow-inner">
              <Smartphone className="mx-auto mb-4 text-gray-300" size={48} />
              <p className="text-xl text-gray-400 font-bold">Nenhuma missão para hoje!</p>
              <p className="text-sm text-gray-400 mt-2">Aproveite seu tempo livre com responsabilidade.</p>
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
                  className={`relative overflow-hidden bg-white p-5 rounded-[32px] border-4 transition-all flex items-center justify-between gap-4 shadow-lg ${
                    done ? 'border-green-500 bg-green-50/30' : 'border-blue-100 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 ${
                      done ? 'bg-green-100 border-green-200' : 'bg-blue-50 border-blue-100'
                    }`}>
                      {task.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-800 leading-tight">{task.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-lg">⏱️ {Math.floor(task.durationSeconds / 60)}m</span>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-lg">⭐ {task.points}pts</span>
                      </div>
                    </div>
                  </div>

                  {done ? (
                    <div className="bg-green-500 text-white p-2 rounded-xl shadow-lg">
                      <CheckCircle2 size={24} />
                    </div>
                  ) : (
                    <button
                      onClick={() => setExecutingTask(task)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
                    >
                      INICIAR <Play size={16} fill="white" />
                    </button>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <footer className="mt-auto py-8 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-2">
            <ShieldAlert size={16} />
            JOYLOCK SECURITY
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Proteção Ativa • Monitoramento em Tempo Real</p>
        </footer>
      </main>

      {/* Smart Lock Overlay */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-blue-900/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] p-8 text-center shadow-2xl border-4 border-red-500"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="text-red-600" size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">ACESSO BLOQUEADO</h2>
              <p className="text-gray-500 mb-8 font-medium leading-relaxed">
                {lockReason}
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => setIsLocked(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                  VOLTAR PARA O JOYLOCK
                </button>
                
                <button
                  onClick={() => setShowPinAuth(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-2xl font-bold text-sm transition-all"
                >
                  SAIR (APENAS RESPONSÁVEIS)
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Technical Status</p>
                <div className="bg-gray-900 rounded-xl p-3 text-left">
                  <code className="text-[10px] text-green-400 font-mono block">
                    ForegroundService: RUNNING<br/>
                    UsageStats: MONITORING<br/>
                    LockTask: ACTIVE
                  </code>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showPinAuth && (
        <PinAuth 
          correctPin={parentConfig.pin}
          onSuccess={handlePinSuccess}
          onCancel={() => setShowPinAuth(false)}
        />
      )}
      {showShop && (
        <Shop onClose={() => setShowShop(false)} />
      )}
      {executingTask && (
        <TaskExecution 
          task={executingTask} 
          onClose={() => setExecutingTask(null)} 
        />
      )}
    </div>
  );
}
