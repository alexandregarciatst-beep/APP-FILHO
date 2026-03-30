export interface LessonValue {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const LESSONS_LIST: LessonValue[] = [
  { id: 'higiene', label: 'Higiene', icon: '🪥', description: 'Pasta de dente sorrindo' },
  { id: 'organizacao', label: 'Organização', icon: '📦', description: 'Caixa de brinquedos arrumada' },
  { id: 'respeito', label: 'Respeito', icon: '🤝', description: 'Crianças apertando as mãos' },
  { id: 'foco', label: 'Foco', icon: '🔍', description: 'Lupa sobre um livro' },
  { id: 'responsabilidade', label: 'Responsabilidade', icon: '🪴', description: 'Criança regando planta' },
  { id: 'gratidao', label: 'Gratidão', icon: '💖', description: 'Mãos fazendo um coração' },
  { id: 'empatia', label: 'Empatia', icon: '🫂', description: 'Criança confortando outra' },
  { id: 'paciencia', label: 'Paciência', icon: '⏳', description: 'Ampulheta com borboleta' },
  { id: 'obediencia', label: 'Obediência', icon: '👂', description: 'Criança ouvindo atentamente' },
  { id: 'honestidade', label: 'Honestidade', icon: '😇', description: 'Pinóquio com nariz normal' },
  { id: 'gentileza', label: 'Gentileza', icon: '🚪', description: 'Segurando a porta' },
  { id: 'saude', label: 'Saúde', icon: '🍎', description: 'Maçã forte e feliz' },
  { id: 'perseveranca', label: 'Perseverança', icon: '🧗', description: 'Alpinista no topo' },
  { id: 'criatividade', label: 'Criatividade', icon: '💡', description: 'Lâmpada colorida' },
  { id: 'equipe', label: 'Trabalho em Equipe', icon: '🐜', description: 'Formigas carregando folha' },
  { id: 'disciplina', label: 'Disciplina', icon: '📅', description: 'Relógio com cronograma' },
  { id: 'autonomia', label: 'Autonomia', icon: '👟', description: 'Amarrando o próprio tênis' },
  { id: 'coragem', label: 'Coragem', icon: '🛡️', description: 'Pequeno herói com capa' },
  { id: 'amizade', label: 'Amizade', icon: '🐾', description: 'Bichinhos abraçados' },
  { id: 'estudo', label: 'Estudo', icon: '🦉', description: 'Coruja sábia lendo' },
  { id: 'ambiente', label: 'Cuidado com o Ambiente', icon: '♻️', description: 'Reciclagem feliz' },
];

export interface SleepConfig {
  bedtime: string; // HH:mm
  wakeupTime: string; // HH:mm
  isEnabled: boolean;
}

export interface GoalConfig {
  targetPoints: number;
  period: 'weekly' | 'monthly';
  rewardDescription: string;
}

export interface ParentConfig {
  pin: string;
  isSetup: boolean;
}

export interface Task {
  id: string;
  name: string;
  icon: string;
  durationSeconds: number;
  points: number;
  daysOfWeek: number[];
  completedAt?: string;
  reflectionValueId?: string;
  order: number;
}

export interface UserStats {
  totalPoints: number;
  completedTasks: string[];
}

export const ICONS_LIST = [
  "📚", "🪥", "❤️", "⭐", "😊", "☀️", "🌙", "☁️", "🍎", "🎮", "🧸", "🥛", "👟", "🧼", "🥦", "🏀", "🎨", "🧹", "🛌"
];
