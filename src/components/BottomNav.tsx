import React from 'react';
import { 
  KeyRound, 
  MessageSquareCode, 
  Play, 
  Sparkles, 
  Globe 
} from 'lucide-react';
import { motion } from 'motion/react';

export type TabId = 'keys' | 'prompts' | 'playground' | 'templates' | 'studio';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  promptsCount?: number;
  keysCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  promptsCount,
  keysCount
}) => {
  const tabs = [
    {
      id: 'keys' as TabId,
      label: 'API Keys',
      icon: KeyRound,
      badge: keysCount
    },
    {
      id: 'prompts' as TabId,
      label: 'Prompts',
      icon: MessageSquareCode,
      badge: promptsCount
    },
    {
      id: 'playground' as TabId,
      label: 'Playground',
      icon: Play,
      isSpecial: true
    },
    {
      id: 'templates' as TabId,
      label: 'Templates',
      icon: Sparkles
    },
    {
      id: 'studio' as TabId,
      label: 'Web & Guide',
      icon: Globe
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0e1117]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 pb-safe shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className="relative flex flex-col items-center justify-center -top-3 group active:scale-90 transition-transform"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                  isActive 
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/30 scale-105 ring-2 ring-blue-400/40' 
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}>
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <span className={`text-[10px] mt-1 font-semibold tracking-tight transition ${
                  isActive ? 'text-blue-400 font-bold' : 'text-slate-400'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="relative w-full py-1 flex flex-col items-center justify-center group active:scale-95 transition-transform"
            >
              {/* Active Pill Indicator */}
              <div className="relative flex items-center justify-center px-4 py-1 rounded-full">
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-blue-500/20 rounded-full border border-blue-500/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 transition-colors duration-200 ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center px-1 z-20">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-colors duration-200 ${
                  isActive ? 'text-blue-300 font-semibold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
