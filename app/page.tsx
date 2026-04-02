'use client';

import React, { useState, useEffect } from 'react';
import { useTasks } from '@/lib/store';
import { Task } from '@/lib/models';
import TaskExecution from '@/components/TaskExecution';
import { Settings, Lock, Unlock, Star, CheckCircle2, Play, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { isSameDay, parseISO } from 'date-fns';

import MathChallenge from '@/components/MathChallenge';
import PinAuth from '@/components/PinAuth';
import SleepModeOverlay from '@/components/SleepModeOverlay';
import Shop from '@/components/Shop';

import SetupWizard from '@/components/SetupWizard';
import KioskLauncher from '@/components/KioskLauncher';

export default function Dashboard() {
  const { parentConfig, isLoaded } = useTasks();

  if (!isLoaded) return null;

  if (!parentConfig.isSetup) {
    return <SetupWizard />;
  }

  return <KioskLauncher />;
}
