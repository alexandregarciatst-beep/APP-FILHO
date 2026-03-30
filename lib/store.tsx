'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, UserStats, SleepConfig, GoalConfig, ParentConfig } from './models';
import { isSameDay, parseISO, setHours, setMinutes } from 'date-fns';

interface TaskContextType {
  tasks: Task[];
  stats: UserStats;
  sleepConfig: SleepConfig;
  goalConfig: GoalConfig;
  parentConfig: ParentConfig;
  addTask: (task: Omit<Task, 'id' | 'order'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (newTasks: Task[]) => void;
  completeTask: (id: string, reflectionId: string) => void;
  updateSleepConfig: (config: SleepConfig) => void;
  updateGoalConfig: (config: GoalConfig) => void;
  updateParentConfig: (config: ParentConfig) => void;
  isDailyComplete: boolean;
  dailyTasks: Task[];
  emergencyUnlock: boolean;
  setEmergencyUnlock: (val: boolean) => void;
  isSleepMode: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({ totalPoints: 0, completedTasks: [] });
  const [sleepConfig, setSleepConfig] = useState<SleepConfig>({ bedtime: '20:00', wakeupTime: '07:00', isEnabled: true });
  const [goalConfig, setGoalConfig] = useState<GoalConfig>({ targetPoints: 100, period: 'weekly', rewardDescription: '' });
  const [parentConfig, setParentConfig] = useState<ParentConfig>({ pin: '', isSetup: false });
  const [isLoaded, setIsLoaded] = useState(false);
  const [emergencyUnlock, setEmergencyUnlock] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('taskhero_tasks');
      const savedStats = localStorage.getItem('taskhero_stats');
      const savedSleep = localStorage.getItem('taskhero_sleep');
      const savedGoal = localStorage.getItem('taskhero_goal');
      const savedParent = localStorage.getItem('taskhero_parent');
      
      setTimeout(() => {
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedStats) setStats(JSON.parse(savedStats));
        if (savedSleep) setSleepConfig(JSON.parse(savedSleep));
        if (savedGoal) setGoalConfig(JSON.parse(savedGoal));
        if (savedParent) setParentConfig(JSON.parse(savedParent));
        setIsLoaded(true);
      }, 0);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('taskhero_tasks', JSON.stringify(tasks));
      localStorage.setItem('taskhero_stats', JSON.stringify(stats));
      localStorage.setItem('taskhero_sleep', JSON.stringify(sleepConfig));
      localStorage.setItem('taskhero_goal', JSON.stringify(goalConfig));
      localStorage.setItem('taskhero_parent', JSON.stringify(parentConfig));
    }
  }, [tasks, stats, sleepConfig, goalConfig, parentConfig, isLoaded]);

  const addTask = (taskData: Omit<Task, 'id' | 'order'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      order: tasks.length,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks.map((t, i) => ({ ...t, order: i })));
  };

  const completeTask = (id: string, reflectionId: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const now = new Date().toISOString();
    setTasks(tasks.map(t => t.id === id ? { ...t, completedAt: now, reflectionValueId: reflectionId } : t));
    setStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + task.points,
      completedTasks: [...prev.completedTasks, id]
    }));
  };

  const updateSleepConfig = (config: SleepConfig) => setSleepConfig(config);
  const updateGoalConfig = (config: GoalConfig) => setGoalConfig(config);
  const updateParentConfig = (config: ParentConfig) => setParentConfig(config);

  const dailyTasks = React.useMemo(() => {
    const today = new Date().getDay(); // 0-6
    return tasks
      .filter(t => t.daysOfWeek.includes(today))
      .sort((a, b) => a.order - b.order);
  }, [tasks]);

  const isSleepMode = React.useMemo(() => {
    if (!sleepConfig.isEnabled) return false;
    const now = new Date();
    const [bedH, bedM] = sleepConfig.bedtime.split(':').map(Number);
    const [wakeH, wakeM] = sleepConfig.wakeupTime.split(':').map(Number);
    
    const bedtimeDate = setMinutes(setHours(new Date(), bedH), bedM);
    const wakeupDate = setMinutes(setHours(new Date(), wakeH), wakeM);

    if (bedtimeDate > wakeupDate) {
      return now >= bedtimeDate || now < wakeupDate;
    } else {
      return now >= bedtimeDate && now < wakeupDate;
    }
  }, [sleepConfig]);

  const isDailyComplete = React.useMemo(() => {
    if (emergencyUnlock) return true;
    if (dailyTasks.length === 0) return true;
    return dailyTasks.every(t => {
      if (!t.completedAt) return false;
      return isSameDay(parseISO(t.completedAt), new Date());
    });
  }, [dailyTasks, emergencyUnlock]);

  return (
    <TaskContext.Provider value={{ 
      tasks, stats, sleepConfig, goalConfig, parentConfig,
      addTask, updateTask, deleteTask, reorderTasks, completeTask, 
      updateSleepConfig, updateGoalConfig, updateParentConfig,
      isDailyComplete, dailyTasks, emergencyUnlock, setEmergencyUnlock,
      isSleepMode
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
}
