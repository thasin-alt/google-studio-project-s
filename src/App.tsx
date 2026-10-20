/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ApiKeyItem, PromptItem } from './types';
import { INITIAL_API_KEYS, INITIAL_PROMPTS, PROMPT_TEMPLATES } from './data/initialData';
import { Navbar } from './components/Navbar';
import { BottomNav, TabId } from './components/BottomNav';
import { KeysVault } from './components/KeysVault';
import { PromptLibrary } from './components/PromptLibrary';
import { Playground } from './components/Playground';
import { TemplatesTool } from './components/TemplatesTool';
import { StudioPortal } from './components/StudioPortal';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Load stored state or fallback to defaults
  const [keys, setKeys] = useState<ApiKeyItem[]>(() => {
    try {
      const saved = localStorage.getItem('google_ai_studio_keys');
      return saved ? JSON.parse(saved) : INITIAL_API_KEYS;
    } catch {
      return INITIAL_API_KEYS;
    }
  });

  const [activeKeyId, setActiveKeyId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('google_ai_studio_active_key_id');
      return saved || (INITIAL_API_KEYS[0]?.id ?? '');
    } catch {
      return INITIAL_API_KEYS[0]?.id ?? '';
    }
  });

  const [prompts, setPrompts] = useState<PromptItem[]>(() => {
    try {
      const saved = localStorage.getItem('google_ai_studio_prompts');
      return saved ? JSON.parse(saved) : INITIAL_PROMPTS;
    } catch {
      return INITIAL_PROMPTS;
    }
  });

  const [activeTab, setActiveTab] = useState<TabId>('keys');
  const [selectedPromptForPlayground, setSelectedPromptForPlayground] = useState<PromptItem | null>(null);

  // Modals state
  const [isOpenAddKeyModal, setIsOpenAddKeyModal] = useState<boolean>(false);
  const [isOpenNewPromptModal, setIsOpenNewPromptModal] = useState<boolean>(false);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('google_ai_studio_keys', JSON.stringify(keys));
    } catch (e) {
      console.warn('Failed to persist keys', e);
    }
  }, [keys]);

  useEffect(() => {
    try {
      localStorage.setItem('google_ai_studio_active_key_id', activeKeyId);
    } catch (e) {
      console.warn('Failed to persist active key', e);
    }
  }, [activeKeyId]);

  useEffect(() => {
    try {
      localStorage.setItem('google_ai_studio_prompts', JSON.stringify(prompts));
    } catch (e) {
      console.warn('Failed to persist prompts', e);
    }
  }, [prompts]);

  const activeKey = keys.find(k => k.id === activeKeyId) || keys[0] || null;

  // Key operations
  const handleSelectActiveKey = (key: ApiKeyItem) => {
    setActiveKeyId(key.id);
  };

  const handleAddKey = (newKeyData: Omit<ApiKeyItem, 'id' | 'createdAt' | 'usageCount' | 'status'>) => {
    const newKey: ApiKeyItem = {
      ...newKeyData,
      id: `key-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
      status: 'valid',
      statusMessage: 'Ready for mobile execution'
    };
    setKeys(prev => [newKey, ...prev]);
    setActiveKeyId(newKey.id);
  };

  const handleDeleteKey = (id: string) => {
    setKeys(prev => {
      const updated = prev.filter(k => k.id !== id);
      if (activeKeyId === id && updated.length > 0) {
        setActiveKeyId(updated[0].id);
      }
      return updated;
    });
  };

  const handleUpdateKeyStatus = (id: string, status: 'valid' | 'testing' | 'invalid' | 'untested', message?: string) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status, statusMessage: message } : k));
  };

  // Prompt operations
  const handleSelectAndRunPrompt = (prompt: PromptItem) => {
    setSelectedPromptForPlayground(prompt);
    setActiveTab('playground');
  };

  const handleSavePrompt = (promptData: Omit<PromptItem, 'id' | 'updatedAt'>) => {
    const newPrompt: PromptItem = {
      ...promptData,
      id: `prompt-${Date.now()}`,
      updatedAt: 'Just now'
    };
    setPrompts(prev => [newPrompt, ...prev]);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleLoadTemplate = (template: typeof PROMPT_TEMPLATES[0]) => {
    const mockPrompt: PromptItem = {
      id: `template-${Date.now()}`,
      title: template.title,
      description: template.description,
      category: 'general',
      systemInstruction: template.system,
      promptText: template.prompt,
      model: template.model,
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
      isFavorite: false,
      tags: ['Template', template.category],
      updatedAt: 'Just now'
    };
    setSelectedPromptForPlayground(mockPrompt);
    setActiveTab('playground');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans selection:bg-blue-500/20 antialiased">
      {/* Google-Styled Mobile Header Bar */}
      <Navbar
        activeKey={activeKey}
        keys={keys}
        onSelectActiveKey={handleSelectActiveKey}
        onOpenAddKey={() => {
          setActiveTab('keys');
          setIsOpenAddKeyModal(true);
        }}
      />

      {/* Main Animated View Container */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-3.5 sm:px-6 pt-4 sm:pt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'keys' && (
            <motion.div
              key="keys"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <KeysVault
                keys={keys}
                activeKeyId={activeKeyId}
                onSelectActiveKey={handleSelectActiveKey}
                onAddKey={handleAddKey}
                onDeleteKey={handleDeleteKey}
                onUpdateKeyStatus={handleUpdateKeyStatus}
                isOpenAddModal={isOpenAddKeyModal}
                onCloseAddModal={() => setIsOpenAddKeyModal(false)}
                onOpenAddModal={() => setIsOpenAddKeyModal(true)}
              />
            </motion.div>
          )}

          {activeTab === 'prompts' && (
            <motion.div
              key="prompts"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <PromptLibrary
                prompts={prompts}
                onSelectAndRunPrompt={handleSelectAndRunPrompt}
                onSavePrompt={handleSavePrompt}
                onDeletePrompt={handleDeletePrompt}
                onToggleFavorite={handleToggleFavorite}
                isOpenNewPromptModal={isOpenNewPromptModal}
                onOpenNewPromptModal={() => setIsOpenNewPromptModal(true)}
                onCloseNewPromptModal={() => setIsOpenNewPromptModal(false)}
              />
            </motion.div>
          )}

          {activeTab === 'playground' && (
            <motion.div
              key="playground"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Playground
                activeKey={activeKey}
                initialPrompt={selectedPromptForPlayground}
                onSaveToLibrary={handleSavePrompt}
                onOpenKeysVault={() => setActiveTab('keys')}
              />
            </motion.div>
          )}

          {activeTab === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <TemplatesTool onLoadTemplate={handleLoadTemplate} />
            </motion.div>
          )}

          {activeTab === 'studio' && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <StudioPortal />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Material 3 Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        keysCount={keys.length}
        promptsCount={prompts.length}
      />
    </div>
  );
}
