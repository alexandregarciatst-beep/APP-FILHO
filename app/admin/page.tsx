'use client';

import React, { useState, useEffect } from 'react';
import { useTasks } from '@/lib/store';
import { Task, ICONS_LIST } from '@/lib/models';
import { ArrowLeft, Plus, Trash2, Edit2, GripVertical, Save, X, AlertTriangle, Moon, Target, Shield, Star, Trophy } from 'lucide-react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PinAuth from '@/components/PinAuth';

export default function AdminScreen() {
  const { 
    tasks, addTask, updateTask, deleteTask, reorderTasks, stats, 
    setEmergencyUnlock, emergencyUnlock, sleepConfig, updateSleepConfig,
    goalConfig, updateGoalConfig, parentConfig, updateParentConfig
  } = useTasks();
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'settings' | 'goals'>('tasks');
  const [showPinSetup, setShowPinSetup] = useState(false);

  useEffect(() => {
    if (!parentConfig.isSetup) {
      const timer = setTimeout(() => {
        setShowPinSetup(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [parentConfig.isSetup]);

  const handleSaveTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      name: formData.get('name') as string,
      icon: (formData.get('icon') as string) || ICONS_LIST[0],
      durationSeconds: parseInt(formData.get('duration') as string) * 60,
      points: parseInt(formData.get('points') as string),
      daysOfWeek: formData.getAll('days').map(d => parseInt(d as string)),
    };

    if (editingTask) {
      updateTask({ ...editingTask, ...taskData });
      setEditingTask(null);
    } else {
      addTask(taskData);
      setIsAdding(false);
    }
  };

  const handlePinSetupSuccess = (newPin: string) => {
    updateParentConfig({ pin: newPin, isSetup: true });
    setShowPinSetup(false);
  };

  const progressPercent = Math.min(100, (stats.totalPoints / goalConfig.targetPoints) * 100);

  return (
    <main className="min-h-screen bg-[#F0F4F8] pb-32">
      {showPinSetup && (
        <PinAuth 
          correctPin="" 
          isSetup={true} 
          onSuccess={handlePinSetupSuccess} 
          onCancel={() => setShowPinSetup(false)} 
        />
      )}

      {/* Header */}
      <header className="bg-white p-6 shadow-md border-b-4 border-[#4A90E2] sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition active:scale-90">
            <ArrowLeft className="text-[#4A90E2]" />
          </Link>
          <h1 className="text-2xl font-bubblegum text-[#4A90E2]">PAINEL DO RESPONSÁVEL</h1>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="text-blue-600" />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex bg-white p-2 rounded-[24px] shadow-sm border-2 border-gray-100">
          {[
            { id: 'tasks', label: 'Missões', icon: Plus },
            { id: 'goals', label: 'Metas', icon: Target },
            { id: 'settings', label: 'Ajustes', icon: Moon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#4A90E2] text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bubblegum text-gray-700">Lista de Missões</h2>
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-[#32CD32] text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-[#2EB82E] transition flex items-center gap-2"
              >
                <Plus size={20} /> NOVA
              </button>
            </div>

            <Reorder.Group axis="y" values={tasks} onReorder={reorderTasks} className="space-y-4">
              {tasks.map((task) => (
                <Reorder.Item 
                  key={task.id} 
                  value={task}
                  className="bg-white p-5 rounded-[28px] shadow-sm border-2 border-gray-100 flex items-center justify-between gap-4 cursor-default group hover:border-[#4A90E2] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="text-gray-300 cursor-grab active:cursor-grabbing" />
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl shadow-inner">
                      {task.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 leading-tight">{task.name}</h3>
                      <p className="text-sm text-gray-400 font-bold mt-1">
                        ⏱️ {Math.floor(task.durationSeconds / 60)}m • ⭐ {task.points}pts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingTask(task)}
                      className="p-3 text-[#4A90E2] bg-blue-50 hover:bg-blue-100 rounded-xl transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bubblegum text-gray-700">Metas e Prêmios</h2>
            
            <div className="bg-white p-8 rounded-[40px] shadow-lg border-4 border-[#FFD700] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Progresso Atual</p>
                    <h3 className="text-4xl font-bubblegum text-[#D0021B]">{stats.totalPoints} / {goalConfig.targetPoints} ⭐</h3>
                  </div>
                  <Trophy className="text-[#FFD700] w-12 h-12" />
                </div>

                <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                  />
                </div>

                <div className="mt-8 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">META DE PONTOS</label>
                    <input 
                      type="number"
                      value={goalConfig.targetPoints}
                      onChange={(e) => updateGoalConfig({ ...goalConfig, targetPoints: parseInt(e.target.value) })}
                      className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#4A90E2] outline-none font-bold text-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">PRÊMIO PROMETIDO 🎁</label>
                    <textarea 
                      value={goalConfig.rewardDescription}
                      onChange={(e) => updateGoalConfig({ ...goalConfig, rewardDescription: e.target.value })}
                      placeholder="Ex: Um sorvete no final de semana!"
                      className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#4A90E2] outline-none font-bold h-24 resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD700]/10 rounded-full blur-3xl" />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bubblegum text-gray-700">Configurações de Bloqueio</h2>

            {/* Sleep Mode Settings */}
            <div className="bg-white p-8 rounded-[40px] shadow-md border-2 border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Moon className="text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">Soneca Noturna</h3>
                </div>
                <button 
                  onClick={() => updateSleepConfig({ ...sleepConfig, isEnabled: !sleepConfig.isEnabled })}
                  className={`w-14 h-8 rounded-full transition-colors relative ${sleepConfig.isEnabled ? 'bg-[#32CD32]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${sleepConfig.isEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Hora de Dormir 🌙</label>
                  <input 
                    type="time"
                    value={sleepConfig.bedtime}
                    onChange={(e) => updateSleepConfig({ ...sleepConfig, bedtime: e.target.value })}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#4A90E2] outline-none font-bold text-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Hora de Acordar ☀️</label>
                  <input 
                    type="time"
                    value={sleepConfig.wakeupTime}
                    onChange={(e) => updateSleepConfig({ ...sleepConfig, wakeupTime: e.target.value })}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#4A90E2] outline-none font-bold text-xl"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Unlock */}
            <div className="bg-red-50 p-8 rounded-[40px] border-4 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500" />
                <h3 className="text-xl font-bubblegum text-red-700 uppercase">Liberação de Emergência</h3>
              </div>
              <p className="text-sm text-red-600 mb-6 font-bold">
                Use apenas em casos especiais. O bloqueio será desativado imediatamente.
              </p>
              <button
                onClick={() => setEmergencyUnlock(!emergencyUnlock)}
                className={`w-full py-4 rounded-full font-bubblegum text-xl shadow-lg transition active:scale-95 ${
                  emergencyUnlock 
                    ? 'bg-white text-red-500 border-2 border-red-500' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {emergencyUnlock ? 'REATIVAR BLOQUEIO 🔒' : 'DESBLOQUEAR AGORA 🔓'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {(isAdding || editingTask) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] w-full max-w-md p-8 shadow-2xl border-4 border-[#4A90E2] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bubblegum text-[#4A90E2]">
                  {editingTask ? 'EDITAR MISSÃO' : 'NOVA MISSÃO'}
                </h2>
                <button onClick={() => { setIsAdding(false); setEditingTask(null); }} className="p-2 text-gray-400 hover:text-gray-600">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSaveTask} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Nome da Missão</label>
                  <input 
                    name="name" 
                    defaultValue={editingTask?.name} 
                    required 
                    className="w-full p-4 bg-gray-100 rounded-2xl border-2 border-transparent focus:border-[#4A90E2] outline-none font-bold"
                    placeholder="Ex: Escovar os dentes"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Tempo (Min)</label>
                    <input 
                      name="duration" 
                      type="number" 
                      defaultValue={editingTask ? Math.floor(editingTask.durationSeconds / 60) : 5} 
                      required 
                      className="w-full p-4 bg-gray-100 rounded-2xl border-2 border-transparent focus:border-[#4A90E2] outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Pontos ⭐</label>
                    <input 
                      name="points" 
                      type="number" 
                      defaultValue={editingTask ? editingTask.points : 10} 
                      required 
                      className="w-full p-4 bg-gray-100 rounded-2xl border-2 border-transparent focus:border-[#4A90E2] outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Ícone da Missão</label>
                  <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-[24px] border-2 border-dashed border-gray-200">
                    {ICONS_LIST.map((icon) => (
                      <label key={icon} className="cursor-pointer">
                        <input 
                          type="radio" 
                          name="icon" 
                          value={icon} 
                          defaultChecked={editingTask ? editingTask.icon === icon : icon === ICONS_LIST[0]}
                          className="hidden peer"
                        />
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 border-transparent peer-checked:border-[#4A90E2] peer-checked:bg-blue-50 peer-checked:scale-110 transition-all">
                          {icon}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Dias Ativos</label>
                  <div className="flex justify-between bg-gray-50 p-3 rounded-2xl">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                      <label key={i} className="cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="days" 
                          value={i} 
                          defaultChecked={editingTask?.daysOfWeek?.includes(i) ?? true}
                          className="hidden peer"
                        />
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm peer-checked:bg-[#FFD700] peer-checked:text-[#2C3E50] transition-all">
                          {day}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#32CD32] hover:bg-[#2EB82E] text-white py-5 rounded-full text-xl font-bubblegum shadow-lg mt-4 flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <Save size={24} /> SALVAR MISSÃO
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
