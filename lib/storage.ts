export interface Task {
  id: string;
  name: string;
  icon: string;
  minMinutes: number;
  points: number;
  orderIndex: number;
  completed: boolean;
  lastCompletedDate?: string;
}

export interface AppSettings {
  lockStartTime: string; // "HH:mm"
  lockEndTime: string;   // "HH:mm"
  totalPoints: number;
  pointsHistory: { date: string; points: number }[];
}

const TASKS_KEY = 'taskhero_tasks_pro';
const SETTINGS_KEY = 'taskhero_settings_pro';

export const storage = {
  getTasks: (): Task[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(TASKS_KEY);
    if (!stored) return [];
    
    const tasks: Task[] = JSON.parse(stored);
    const today = new Date().toISOString().split('T')[0];
    
    return tasks.map(task => {
      if (task.lastCompletedDate !== today) {
        return { ...task, completed: false };
      }
      return task;
    }).sort((a, b) => a.orderIndex - b.orderIndex);
  },

  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  getSettings: (): AppSettings => {
    if (typeof window === 'undefined') return { lockStartTime: '08:00', lockEndTime: '20:00', totalPoints: 0, pointsHistory: [] };
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return { lockStartTime: '08:00', lockEndTime: '20:00', totalPoints: 0, pointsHistory: [] };
    return JSON.parse(stored);
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  addPoints: (points: number) => {
    const settings = storage.getSettings();
    const today = new Date().toISOString().split('T')[0];
    
    settings.totalPoints += points;
    
    const historyIndex = settings.pointsHistory.findIndex(h => h.date === today);
    if (historyIndex > -1) {
      settings.pointsHistory[historyIndex].points += points;
    } else {
      settings.pointsHistory.push({ date: today, points });
    }
    
    storage.saveSettings(settings);
  },

  completeTask: (id: string, points: number) => {
    const tasks = storage.getTasks();
    const today = new Date().toISOString().split('T')[0];
    const updated = tasks.map(t => 
      t.id === id ? { ...t, completed: true, lastCompletedDate: today } : t
    );
    storage.saveTasks(updated);
    storage.addPoints(points);
  }
};
