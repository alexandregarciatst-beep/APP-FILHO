import type { Metadata } from 'next';
import { Poppins, Bubblegum_Sans } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const bubblegum = Bubblegum_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bubblegum',
});

export const metadata: Metadata = {
  title: 'TaskHero Kids',
  description: 'Transforme tarefas em aventuras!',
};

import { TaskProvider } from '@/lib/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${bubblegum.variable}`}>
      <body className="font-sans antialiased bg-[#F0F9FF] text-[#1E293B] overflow-x-hidden" suppressHydrationWarning>
        <TaskProvider>
          {children}
        </TaskProvider>
      </body>
    </html>
  );
}
