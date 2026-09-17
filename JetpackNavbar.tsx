import React from 'react';
import { Film, Sparkles, Bot, Search, ShoppingBag } from 'lucide-react';
import { ActiveTab } from '../types';

interface JetpackNavbarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  cartCount: number;
}

export const JetpackNavbar: React.FC<JetpackNavbarProps> = ({
  activeTab,
  onChangeTab,
  cartCount,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string; highlight?: boolean }[] = [
    {
      id: 'reels',
      label: 'Reels',
      icon: <Film className="w-5 h-5" />,
    },
    {
      id: 'crave_ai',
      label: 'Crave AI',
      icon: <Bot className="w-5 h-5" />,
      highlight: true,
      badge: 'IQ',
    },
    {
      id: 'search',
      label: 'Explore',
      icon: <Search className="w-5 h-5" />,
    },
    {
      id: 'cart_orders',
      label: 'Cart & Track',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: cartCount > 0 ? cartCount : undefined,
    },
  ];

  return (
    <nav
      id="jetpack-bottom-navigation"
      className="w-full bg-black/98 backdrop-blur-2xl border-t border-red-950/60 px-3 py-2 flex items-center justify-around z-30 shrink-0 select-none shadow-[0_-12px_35px_rgba(0,0,0,0.9)]"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onChangeTab(tab.id)}
            className="flex flex-col items-center justify-center flex-1 py-0.5 px-1 relative group cursor-pointer transition-all duration-200"
          >
            {/* Active Pill Indicator */}
            <div
              className={`relative px-5 py-1.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white shadow-[0_0_22px_rgba(239,68,68,0.6)] scale-105 ring-1 ring-white/30'
                  : 'text-neutral-400 group-hover:text-neutral-200 group-hover:bg-neutral-900/70'
              }`}
            >
              {tab.icon}

              {/* Badge Counter */}
              {tab.badge !== undefined && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] text-center rounded-full text-[9px] font-black bg-gradient-to-r from-red-600 to-orange-500 text-white border-2 border-black shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                  {tab.badge}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] mt-1 tracking-wide font-brand transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent font-black scale-105 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                  : 'text-neutral-400 font-semibold group-hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
