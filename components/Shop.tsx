'use client';

import React from 'react';
import { useTasks } from '@/lib/store';
import { ShopItem } from '@/lib/models';
import { X, ShoppingBag, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopProps {
  onClose: () => void;
}

export default function Shop({ onClose }: ShopProps) {
  const { shopItems, stats, buyItem } = useTasks();

  const handleBuy = (item: ShopItem) => {
    if (stats.totalPoints >= item.price) {
      buyItem(item.id);
    }
  };

  const isPurchased = (itemId: string) => {
    return stats.purchasedItems.includes(itemId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] border-8 border-blue-400 shadow-2xl"
      >
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />
            <h2 className="text-3xl font-bubblegum">LOJINHA MÁGICA</h2>
          </div>
          <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Points Bar */}
        <div className="bg-blue-50 p-4 border-b-2 border-blue-100 flex justify-center items-center gap-2">
          <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Seus Pontos:</span>
          <div className="bg-white px-4 py-1 rounded-full border-2 border-blue-200 flex items-center gap-2 shadow-sm">
            <Star className="text-yellow-500 fill-yellow-500 w-5 h-5" />
            <span className="text-2xl font-bubblegum text-blue-600">{stats.totalPoints}</span>
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-6 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {shopItems.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-400 font-bold text-lg">A lojinha está vazia no momento... 🕸️</p>
              <p className="text-sm text-gray-400">Peça para o papai ou a mamãe adicionarem prêmios!</p>
            </div>
          ) : (
            shopItems.map((item) => {
              const bought = item.isOneTime && isPurchased(item.id);
              const canAfford = stats.totalPoints >= item.price;

              return (
                <div 
                  key={item.id}
                  className={`bg-white rounded-[28px] p-4 border-4 transition-all flex flex-col gap-2 relative overflow-hidden shadow-sm min-h-[210px] ${
                    bought ? 'opacity-70 border-gray-200' : 'border-blue-100 hover:border-blue-300'
                  }`}
                >
                  {bought && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                      <div className="bg-green-500 text-white px-3 py-1.5 rounded-full font-bubblegum text-base shadow-lg flex items-center gap-2 rotate-[-5deg]">
                        <Check size={18} /> COMPRADO!
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div className="text-3xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md border-2 border-gray-50 shrink-0">
                      {item.icon}
                    </div>
                    <div className="bg-[#FEF9C3] text-[#854D0E] px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 border-2 border-[#FEF08A] shrink-0">
                      ⭐ {item.price}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-0.5">
                    <h3 className="text-lg font-bubblegum text-blue-900 leading-tight break-words">{item.name}</h3>
                    <p className="text-[9px] text-gray-400 font-bold leading-tight line-clamp-2">{item.description}</p>
                  </div>

                  <button
                    disabled={bought || !canAfford}
                    onClick={() => handleBuy(item)}
                    className={`w-full py-2 mt-auto rounded-xl font-bubblegum text-base shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 ${
                      bought 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : canAfford
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_3px_0_#1E40AF]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {bought ? 'RESGATADO' : 'COMPRAR'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Mostre a compra para o responsável para receber seu prêmio! 🎁
        </div>
      </motion.div>
    </div>
  );
}
