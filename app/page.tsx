'use client';

import React from 'react';
import { useTasks } from '@/lib/store';
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
