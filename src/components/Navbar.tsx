import React, { useState } from 'react';
import { ApiKeyItem } from '../types';
import { 
  KeyRound, 
  ExternalLink, 
  FolderGit2, 
  ChevronDown, 
  Check, 
  Sparkles,
  ShieldCheck,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeKey: ApiKeyItem | null;
  keys: ApiKeyItem[];
  onSelectActiveKey: (key: ApiKeyItem) => void;
  onOpenAddKey: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeKey,
  keys,
  onSelectActiveKey,
  onOpenAddKey
}) => {
  const [showKeyMenu, setShowKeyMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0e1117]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-5 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[1.5px] shadow-sm shadow-blue-500/20">
            <div className="w-full h-full bg-[#0e1117] rounded-[10px] flex items-center justify-center">
              {/* Google 4-Color Sparkle SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" fill="url(#google-sparkle-gradient)" />
                <defs>
                  <linearGradient id="google-sparkle-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4285F4" />
                    <stop offset="0.33" stopColor="#9B72CB" />
                    <stop offset="0.66" stopColor="#D96570" />
                    <stop offset="1" stopColor="#F4B400" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
                Google <span className="text-blue-400 font-medium">AI Studio</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold tracking-wide bg-blue-500/15 text-blue-300 border border-blue-500/30">
                MOBILE
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-0.5 hidden xs:block">Keys & Prompts Console</span>
          </div>
        </div>

        {/* Right side: Active Key Pill & Account */}
        <div className="flex items-center space-x-2">
          
          {/* Active Key Selector Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowKeyMenu(!showKeyMenu);
                setShowProfileMenu(false);
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs text-slate-200 transition-all shadow-sm active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span className="max-w-[90px] sm:max-w-[120px] truncate font-medium text-[11px] sm:text-xs">
                {activeKey ? activeKey.name : 'No Key'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showKeyMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#161a22] border border-slate-700/80 shadow-2xl p-2 z-50 text-xs"
                >
                  <div className="px-2.5 py-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">Select Active Key</span>
                    <button
                      onClick={() => {
                        setShowKeyMenu(false);
                        onOpenAddKey();
                      }}
                      className="text-blue-400 hover:text-blue-300 font-medium text-[11px]"
                    >
                      + Add Key
                    </button>
                  </div>

                  <div className="max-h-56 overflow-y-auto py-1 space-y-1">
                    {keys.map((k) => {
                      const isSelected = activeKey?.id === k.id;
                      return (
                        <button
                          key={k.id}
                          onClick={() => {
                            onSelectActiveKey(k);
                            setShowKeyMenu(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition ${
                            isSelected ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30' : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="font-medium truncate">{k.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              {k.key.substring(0, 10)}...{k.key.substring(k.key.length - 4)}
                            </p>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> Secure Local Storage
                    </span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Get Keys</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowKeyMenu(false);
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-slate-800 hover:ring-blue-500/50 transition active:scale-95"
            >
              S
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#161a22] border border-slate-700/80 shadow-2xl p-3 z-50 text-xs"
                >
                  <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
                    <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm text-white">
                      S
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-white truncate">Sumon Bristy</p>
                      <p className="text-[11px] text-slate-400 truncate font-mono">sumonbristy538@gmail.com</p>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <a
                      href="https://aistudio.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>Google AI Studio</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                    <a
                      href="https://ai.google.dev/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition"
                    >
                      <span className="flex items-center gap-2">
                        <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Gemini API Docs</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[10.5px] text-slate-400">
                    Google Material 3 Native Experience
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </header>
  );
};
