'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Settings, Lock, Smartphone, CheckCircle2, AlertTriangle, ArrowRight, Key } from 'lucide-react';
import { useTasks } from '@/lib/store';

export default function SetupWizard() {
  const { parentConfig, updateParentConfig } = useTasks();
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState('');

  const steps = [
    {
      title: "Bem-vindo ao JOYLOCK",
      description: "Vamos configurar o bloqueio de segurança para proteger seu filho.",
      icon: <Smartphone className="w-16 h-16 text-blue-500" />,
      action: () => setStep(1),
      buttonText: "Começar Configuração"
    },
    {
      title: "Administrador do Dispositivo",
      description: "Isso impede que o app seja desinstalado ou fechado sem permissão.",
      icon: <Shield className="w-16 h-16 text-red-500" />,
      action: () => {
        updateParentConfig({
          ...parentConfig,
          setupSteps: { ...parentConfig.setupSteps, admin: true }
        });
        setStep(2);
      },
      buttonText: "Ativar Administrador",
      technical: "startActivity(Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN))"
    },
    {
      title: "Acesso ao Uso",
      description: "Permite que o JOYLOCK monitore quais apps estão sendo abertos.",
      icon: <Settings className="w-16 h-16 text-orange-500" />,
      action: () => {
        updateParentConfig({
          ...parentConfig,
          setupSteps: { ...parentConfig.setupSteps, usage: true }
        });
        setStep(3);
      },
      buttonText: "Permitir Acesso ao Uso",
      technical: "startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))"
    },
    {
      title: "Sobreposição de Tela",
      description: "Necessário para bloquear outros apps imediatamente.",
      icon: <Smartphone className="w-16 h-16 text-purple-500" />,
      action: () => {
        updateParentConfig({
          ...parentConfig,
          setupSteps: { ...parentConfig.setupSteps, overlay: true }
        });
        setStep(4);
      },
      buttonText: "Ativar Sobreposição",
      technical: "startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION))"
    },
    {
      title: "Definir PIN de Segurança",
      description: "Crie um código de 4 dígitos para você (responsável) sair do modo bloqueio.",
      icon: <Key className="w-16 h-16 text-green-500" />,
      isPin: true,
      action: () => {
        if (pin.length === 4) {
          updateParentConfig({
            ...parentConfig,
            pin: pin,
            setupSteps: { ...parentConfig.setupSteps, kiosk: true }
          });
          setStep(5);
        }
      },
      buttonText: "Salvar PIN"
    },
    {
      title: "Tudo Pronto!",
      description: "O JOYLOCK está configurado e pronto para proteger.",
      icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
      action: () => {
        updateParentConfig({
          ...parentConfig,
          isSetup: true
        });
      },
      buttonText: "Ativar Modo Kiosk Agora"
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-6 z-50 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[40px] shadow-2xl border-4 border-blue-100 overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 flex">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 transition-all duration-500 ${i <= step ? 'bg-blue-500' : 'bg-transparent'}`}
            />
          ))}
        </div>

        <div className="p-8 flex flex-col items-center text-center gap-6">
          <motion.div
            key={step}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-blue-50 rounded-full"
          >
            {currentStep.icon}
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentStep.title}</h2>
            <p className="text-gray-500 leading-relaxed">{currentStep.description}</p>
          </div>

          {currentStep.isPin && (
            <div className="flex gap-4 justify-center my-4">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                    pin[i] ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {pin[i] ? '●' : ''}
                </div>
              ))}
              <input 
                type="tel"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="absolute opacity-0 pointer-events-none"
              />
            </div>
          )}

          {currentStep.technical && (
            <div className="w-full bg-gray-900 rounded-xl p-4 text-left overflow-x-auto">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Android Implementation</p>
              <code className="text-xs text-blue-400 font-mono">
                {currentStep.technical}
              </code>
            </div>
          )}

          <div className="w-full space-y-4 mt-4">
            <button
              onClick={currentStep.action}
              disabled={currentStep.isPin && pin.length !== 4}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {currentStep.buttonText}
              <ArrowRight size={20} />
            </button>

            {step === 0 && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl text-left border border-amber-100">
                <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={20} />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>AVISO:</strong> Para bloqueio total do celular, é necessário configurar como dispositivo protegido (Device Owner). Esta etapa é exigida pelo Android.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">JoyLock Security Protocol v1.0</p>
        </div>
      </motion.div>
    </div>
  );
}
