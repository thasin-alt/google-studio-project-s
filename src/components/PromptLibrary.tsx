import React, { useState } from 'react';
import { PromptItem } from '../types';
import { GEMINI_MODELS, PROMPT_TEMPLATES } from '../data/initialData';
import { 
  MessageSquareCode, 
  Search, 
  Plus, 
  Star, 
  Play, 
  Copy, 
  Check, 
  Trash2, 
  Sliders, 
  Tag, 
  Sparkles, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromptLibraryProps {
  prompts: PromptItem[];
  onSelectAndRunPrompt: (prompt: PromptItem) => void;
  onSavePrompt: (prompt: Omit<PromptItem, 'id' | 'updatedAt'>) => void;
  onDeletePrompt: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isOpenNewPromptModal: boolean;
  onOpenNewPromptModal: () => void;
  onCloseNewPromptModal: () => void;
}

export const PromptLibrary: React.FC<PromptLibraryProps> = ({
  prompts,
  onSelectAndRunPrompt,
  onSavePrompt,
  onDeletePrompt,
  onToggleFavorite,
  isOpenNewPromptModal,
  onOpenNewPromptModal,
  onCloseNewPromptModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New prompt form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<PromptItem['category']>('general');
  const [formSystem, setFormSystem] = useState('');
  const [formText, setFormText] = useState('');
  const [formModel, setFormModel] = useState('gemini-2.5-flash');
  const [formTemp, setFormTemp] = useState(0.7);

  const categories = [
    { id: 'all', label: 'All Prompts' },
    { id: 'favorites', label: 'Starred' },
    { id: 'extraction', label: 'Extraction' },
    { id: 'vision', label: 'Multimodal' },
    { id: 'code', label: 'Code & Dev' },
    { id: 'system', label: 'System Prompts' },
    { id: 'creative', label: 'Creative' }
  ];

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return p.isFavorite;
    return p.category === selectedCategory;
  });

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyTemplate = (tmpl: typeof PROMPT_TEMPLATES[0]) => {
    setFormTitle(tmpl.title);
    setFormText(tmpl.prompt);
    setFormSystem(tmpl.system || '');
    setFormModel(tmpl.model);
  };

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formText.trim()) return;

    onSavePrompt({
      title: formTitle.trim(),
      description: formText.substring(0, 70) + '...',
      category: formCategory,
      systemInstruction: formSystem.trim(),
      promptText: formText.trim(),
      model: formModel,
      temperature: formTemp,
      topP: 0.95,
      maxOutputTokens: 2048,
      isFavorite: false,
      tags: [formCategory.toUpperCase(), 'Custom']
    });

    // Reset & close
    setFormTitle('');
    setFormSystem('');
    setFormText('');
    onCloseNewPromptModal();
  };

  return (
    <div className="space-y-4 pb-24">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <MessageSquareCode className="w-5 h-5 text-blue-400" />
            <span>Prompt Laboratory</span>
          </h2>
          <p className="text-xs text-slate-400">Save, organize, and execute Gemini prompt architectures</p>
        </div>

        <button
          onClick={onOpenNewPromptModal}
          className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Prompt</span>
        </button>
      </div>

      {/* Search & Filter Pills */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts by title, keywords, or tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.id === 'favorites' && <Star className="w-3 h-3 fill-current text-amber-300 mr-0.5" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt Cards Grid */}
      <div className="space-y-3">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-6 space-y-3">
            <MessageSquareCode className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No prompts match your filter</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-blue-400 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredPrompts.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-3 group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-white group-hover:text-blue-200 transition-colors">
                      {item.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {item.model}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                </div>

                {/* Star Button */}
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  className={`p-1.5 rounded-lg transition active:scale-90 ${
                    item.isFavorite
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                  }`}
                  title={item.isFavorite ? 'Unstar' : 'Star prompt'}
                >
                  <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Prompt Text Preview Box */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono text-slate-300 line-clamp-2 select-all">
                {item.promptText}
              </div>

              {/* Tags & Footer Controls */}
              <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-800/60">
                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-500">Temp:</span>
                  <span className="font-mono text-slate-300 font-semibold">{item.temperature}</span>
                  <span className="text-slate-700">•</span>
                  <span className="text-slate-500">{item.updatedAt}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyPrompt(item.promptText, item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Copy Prompt"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => onDeletePrompt(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectAndRunPrompt(item)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm transition active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run</span>
                  </button>
                </div>
              </div>

            </motion.div>
          ))
        )}
      </div>

      {/* New Prompt Modal */}
      <AnimatePresence>
        {isOpenNewPromptModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-[#161a22] border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Create New Prompt</h3>
                    <p className="text-[11px] text-slate-400">Save prompt architecture to your library</p>
                  </div>
                </div>
                <button
                  onClick={onCloseNewPromptModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Template Picker */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Or start with a Google AI Studio template:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {PROMPT_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-300 text-[11px] whitespace-nowrap flex-shrink-0 transition active:scale-95"
                    >
                      ⚡ {tmpl.title}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCreatePrompt} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Prompt Title *</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Markdown Table Formatter"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as PromptItem['category'])}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="extraction">Structured Extraction</option>
                      <option value="vision">Vision / Multimodal</option>
                      <option value="code">Code & Development</option>
                      <option value="system">System Prompt</option>
                      <option value="creative">Creative & UX</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    System Instructions <span className="text-slate-500">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formSystem}
                    onChange={(e) => setFormSystem(e.target.value)}
                    placeholder="Define persona, tone, guidelines, or format constraints..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none font-mono text-[11.5px]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Prompt Content *</label>
                  <textarea
                    rows={4}
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    placeholder="Enter your prompt text here..."
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono text-[11.5px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Default Model</label>
                    <select
                      value={formModel}
                      onChange={(e) => setFormModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      {GEMINI_MODELS.map(m => (
                        <option key={m.id} value={m.id}>{m.displayName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-slate-300">Temperature</label>
                      <span className="font-mono text-blue-400 font-semibold">{formTemp}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={0.1}
                      value={formTemp}
                      onChange={(e) => setFormTemp(parseFloat(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onCloseNewPromptModal}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30 transition active:scale-95"
                  >
                    Save to Library
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
