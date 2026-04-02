'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, UserStats, SleepConfig, GoalConfig, ParentConfig, ShopItem } from './models';
import { isSameDay, parseISO, setHours, setMinutes } from 'date-fns';

interface TaskContextType {
  tasks: Task[];
  stats: UserStats;
  sleepConfig: SleepConfig;
  goalConfig: GoalConfig;
  parentConfig: ParentConfig;
  shopItems: ShopItem[];
  addTask: (task: Omit<Task, 'id' | 'order'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (newTasks: Task[]) => void;
  completeTask: (id: string, reflectionId: string) => void;
  addShopItem: (item: Omit<ShopItem, 'id'>) => void;
  updateShopItem: (item: ShopItem) => void;
  deleteShopItem: (id: string) => void;
  buyItem: (id: string) => void;
  removePurchase: (purchaseId: string) => void;
  resetPoints: () => void;
  updateSleepConfig: (config: SleepConfig) => void;
  updateGoalConfig: (config: GoalConfig) => void;
  updateParentConfig: (config: ParentConfig) => void;
  isDailyComplete: boolean;
  dailyTasks: Task[];
  emergencyUnlock: boolean;
  setEmergencyUnlock: (val: boolean) => void;
  manualSleepUnlock: boolean;
  setManualSleepUnlock: (val: boolean) => void;
  isSleepMode: boolean;
  isLoaded: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({ totalPoints: 0, completedTasks: [], purchasedItems: [], purchaseHistory: [] });
  const [sleepConfig, setSleepConfig] = useState<SleepConfig>({ bedtime: '20:00', wakeupTime: '07:00', isEnabled: true });
  const [goalConfig, setGoalConfig] = useState<GoalConfig>({ targetPoints: 100, period: 'weekly', rewardDescription: '' });
  const [parentConfig, setParentConfig] = useState<ParentConfig>({ 
    pin: '', 
    isSetup: false,
    setupSteps: {
      admin: false,
      usage: false,
      overlay: false,
      kiosk: false
    }
  });
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [emergencyUnlock, setEmergencyUnlock] = useState(false);
  const [manualSleepUnlock, setManualSleepUnlock] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('taskhero_tasks');
      const savedStats = localStorage.getItem('taskhero_stats');
      const savedSleep = localStorage.getItem('taskhero_sleep');
      const savedGoal = localStorage.getItem('taskhero_goal');
      const savedParent = localStorage.getItem('taskhero_parent');
      const savedShop = localStorage.getItem('taskhero_shop');
      
      setTimeout(() => {
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
        }
        if (savedStats) {
          const parsedStats = JSON.parse(savedStats);
          setStats({
            totalPoints: parsedStats.totalPoints ?? 0,
            completedTasks: parsedStats.completedTasks ?? [],
            purchasedItems: parsedStats.purchasedItems ?? [],
            purchaseHistory: parsedStats.purchaseHistory ?? [],
          });
        }
        if (savedSleep) {
          const parsedSleep = JSON.parse(savedSleep);
          setSleepConfig({
            bedtime: parsedSleep.bedtime ?? '20:00',
            wakeupTime: parsedSleep.wakeupTime ?? '07:00',
            isEnabled: parsedSleep.isEnabled ?? true,
          });
        }
        if (savedGoal) {
          const parsedGoal = JSON.parse(savedGoal);
          setGoalConfig({
            targetPoints: parsedGoal.targetPoints ?? 100,
            period: parsedGoal.period ?? 'weekly',
            rewardDescription: parsedGoal.rewardDescription ?? '',
          });
        }
        if (savedParent) {
          const parsedParent = JSON.parse(savedParent);
          setParentConfig({
            pin: parsedParent.pin ?? '',
            isSetup: parsedParent.isSetup ?? false,
            setupSteps: parsedParent.setupSteps ?? {
              admin: false,
              usage: false,
              overlay: false,
              kiosk: false
            }
          });
        }
        
        if (savedShop) {
          const parsedShop = JSON.parse(savedShop);
          setShopItems(Array.isArray(parsedShop) ? parsedShop : []);
        } else {
          // Default shop items
          setShopItems([
            { id: '1', name: '30 min de Videogame', icon: '🎮', price: 50, description: 'Vale 30 minutos de diversão no seu jogo favorito!', isOneTime: true },
            { id: '2', name: 'Escolher o Jantar', icon: '🍕', price: 100, description: 'Você escolhe o que vamos comer hoje à noite!', isOneTime: true },
            { id: '3', name: 'Sorvete Especial', icon: '🍦', price: 30, description: 'Um sorvete delicioso com cobertura!', isOneTime: true },
          ]);
        }
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
      localStorage.setItem('taskhero_shop', JSON.stringify(shopItems));
    }
  }, [tasks, stats, sleepConfig, goalConfig, parentConfig, shopItems, isLoaded]);

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

  const addShopItem = (itemData: Omit<ShopItem, 'id'>) => {
    const newItem: ShopItem = { ...itemData, id: crypto.randomUUID() };
    setShopItems([...shopItems, newItem]);
  };

  const updateShopItem = (updatedItem: ShopItem) => {
    setShopItems(shopItems.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const deleteShopItem = (id: string) => {
    setShopItems(shopItems.filter(i => i.id !== id));
  };

  const buyItem = (id: string) => {
    const item = shopItems.find(i => i.id === id);
    if (!item || stats.totalPoints < item.price) return;

    const newPurchase = {
      id: crypto.randomUUID(),
      itemId: item.id,
      itemName: item.name,
      itemIcon: item.icon,
      price: item.price,
      timestamp: new Date().toISOString(),
    };

    setStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints - item.price,
      purchasedItems: [...prev.purchasedItems, id],
      purchaseHistory: [newPurchase, ...prev.purchaseHistory],
    }));
  };

  const removePurchase = (purchaseId: string) => {
    setStats(prev => ({
      ...prev,
      purchaseHistory: prev.purchaseHistory.filter(p => p.id !== purchaseId)
    }));
  };

  const resetPoints = () => {
    setStats(prev => ({ 
      ...prev, 
      totalPoints: 0,
      completedTasks: [] // Limpa as tarefas concluídas para permitir recomeçar
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
    if (manualSleepUnlock) return false;
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
  }, [sleepConfig, manualSleepUnlock]);

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
      tasks, stats, sleepConfig, goalConfig, parentConfig, shopItems,
      addTask, updateTask, deleteTask, reorderTasks, completeTask, 
      addShopItem, updateShopItem, deleteShopItem, buyItem, removePurchase, resetPoints,
      updateSleepConfig, updateGoalConfig, updateParentConfig,
      isDailyComplete, dailyTasks, emergencyUnlock, setEmergencyUnlock,
      manualSleepUnlock, setManualSleepUnlock,
      isSleepMode, isLoaded
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
