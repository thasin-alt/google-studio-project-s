import React, { useState } from 'react';
import { ApiKeyItem } from '../types';
import { validateApiKey } from '../services/geminiService';
import QRCode from 'qrcode';
import { 
  KeyRound, 
  Plus, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  QrCode, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  RefreshCw,
  X,
  AlertCircle,
  HelpCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KeysVaultProps {
  keys: ApiKeyItem[];
  activeKeyId: string;
  onSelectActiveKey: (key: ApiKeyItem) => void;
  onAddKey: (newKey: Omit<ApiKeyItem, 'id' | 'createdAt' | 'usageCount' | 'status'>) => void;
  onDeleteKey: (id: string) => void;
  onUpdateKeyStatus: (id: string, status: 'valid' | 'testing' | 'invalid' | 'untested', message?: string) => void;
  isOpenAddModal: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const KeysVault: React.FC<KeysVaultProps> = ({
  keys,
  activeKeyId,
  onSelectActiveKey,
  onAddKey,
  onDeleteKey,
  onUpdateKeyStatus,
  isOpenAddModal,
  onCloseAddModal,
  onOpenAddModal
}) => {
  const [revealedKeyIds, setRevealedKeyIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);
  
  // QR Share state
  const [qrModalKey, setQrModalKey] = useState<ApiKeyItem | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Add Form state
  const [formName, setFormName] = useState('');
  const [formKey, setFormKey] = useState('');
  const [formProject, setFormProject] = useState('Studio-Mobile-App');
  const [formTier, setFormTier] = useState<'free' | 'payg'>('free');
  const [formError, setFormError] = useState('');

  const toggleReveal = (id: string) => {
    setRevealedKeyIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTestKey = async (item: ApiKeyItem) => {
    setTestingKeyId(item.id);
    onUpdateKeyStatus(item.id, 'testing', 'Checking connection...');
    
    const result = await validateApiKey(item.key);
    
    setTestingKeyId(null);
    onUpdateKeyStatus(item.id, result.valid ? 'valid' : 'invalid', result.message);
  };

  const openQrModal = async (item: ApiKeyItem) => {
    setQrModalKey(item);
    try {
      const url = await QRCode.toDataURL(item.key, {
        width: 240,
        margin: 2,
        color: { dark: '#0a0f1d', light: '#ffffff' }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanKey = formKey.trim();
    if (!cleanKey) {
      setFormError('Please enter a valid Google Gemini API key.');
      return;
    }

    onAddKey({
      name: formName.trim() || 'Gemini Mobile Key',
      key: cleanKey,
      project: formProject.trim() || 'Default Project',
      tier: formTier,
      isActive: true,
      notes: 'Added via Mobile Vault'
    });

    setFormName('');
    setFormKey('');
    onCloseAddModal();
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormKey(text.trim());
      }
    } catch {
      // clipboard access might be blocked
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header Info Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">Google AI Studio API Keys</h2>
            </div>
            <p className="text-xs text-slate-300">
              Manage your Gemini API keys locally with instant quota testing, secure display, and mobile execution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Add Key</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px]">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Total Keys</span>
            <span className="font-bold text-white text-xs sm:text-sm">{keys.length} Configured</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Free Tier RPM</span>
            <span className="font-bold text-emerald-400 text-xs sm:text-sm">15 RPM / 1M Context</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Storage Mode</span>
            <span className="font-bold text-blue-400 text-xs sm:text-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Private Device
            </span>
          </div>
        </div>
      </div>

      {/* Keys List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Configured Keys ({keys.length})
          </span>
          <span className="text-[11px] text-slate-500">Tap key to activate</span>
        </div>

        <div className="space-y-3">
          {keys.map((item) => {
            const isActive = activeKeyId === item.id;
            const isRevealed = !!revealedKeyIds[item.id];
            const isTesting = testingKeyId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isActive
                    ? 'bg-slate-900/95 border-blue-500/60 shadow-lg shadow-blue-900/10 ring-1 ring-blue-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 w-full" />
                )}

                <div className="p-4 space-y-3">
                  
                  {/* Title & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm text-white">{item.name}</h3>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            ACTIVE
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${
                          item.tier === 'payg'
                            ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {item.tier === 'payg' ? 'Pay-as-you-go' : 'Free Tier'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Project: <span className="text-slate-300">{item.project}</span> • Added {item.createdAt}
                      </p>
                    </div>

                    {/* Quick Action: Select as Active */}
                    {!isActive && (
                      <button
                        onClick={() => onSelectActiveKey(item)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-95 flex-shrink-0"
                      >
                        Set Active
                      </button>
                    )}
                  </div>

                  {/* Obfuscated Key Box */}
                  <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800/90 rounded-xl px-3 py-2">
                    <div className="font-mono text-xs text-slate-300 truncate select-all">
                      {isRevealed ? item.key : `${item.key.substring(0, 8)}••••••••••••••••••••${item.key.substring(item.key.length - 4)}`}
                    </div>

                    <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0">
                      <button
                        onClick={() => toggleReveal(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title={isRevealed ? "Hide Key" : "Reveal Key"}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopy(item.key, item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Copy Key"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => openQrModal(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Share via QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Status & Test Verification Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        item.status === 'valid'
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                          : item.status === 'testing'
                          ? 'bg-blue-400 animate-ping'
                          : item.status === 'invalid'
                          ? 'bg-red-400'
                          : 'bg-amber-400'
                      }`} />
                      <span className="text-slate-300 truncate">
                        {item.statusMessage || (item.status === 'valid' ? 'Key verified & ready' : 'Untested key')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleTestKey(item)}
                        disabled={isTesting}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition active:scale-95 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 text-blue-400 ${isTesting ? 'animate-spin' : ''}`} />
                        <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                      </button>

                      {keys.length > 1 && (
                        <button
                          onClick={() => onDeleteKey(item.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Remove Key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* QR Code Share Modal */}
      <AnimatePresence>
        {qrModalKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#161a22] border border-slate-700/80 rounded-2xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-blue-400" /> Transfer Key via QR
                </span>
                <button
                  onClick={() => setQrModalKey(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl mx-auto inline-block shadow-inner">
                {qrDataUrl && <img src={qrDataUrl} alt="API Key QR Code" className="w-48 h-48" />}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-200">{qrModalKey.name}</p>
                <p className="text-[11px] text-slate-400">
                  Scan with your other mobile phone camera or scanner to transfer without sending plain text keys over chat.
                </p>
              </div>

              <button
                onClick={() => setQrModalKey(null)}
                className="w-full py-2 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Key Modal / Bottom Sheet */}
      <AnimatePresence>
        {isOpenAddModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-[#161a22] border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Drag Handle for mobile sheet */}
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Add Gemini API Key</h3>
                    <p className="text-[11px] text-slate-400">Securely store and activate in your mobile vault</p>
                  </div>
                </div>
                <button
                  onClick={onCloseAddModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitAdd} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Key Label</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. My Mobile Assistant Key"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-slate-300">Google Gemini API Key *</label>
                    <button
                      type="button"
                      onClick={pasteFromClipboard}
                      className="text-blue-400 hover:underline text-[11px]"
                    >
                      Paste from clipboard
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value)}
                    placeholder="AIzaSy..."
                    required
                    className="w-full px-3 py-2.5 font-mono rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[10.5px] text-slate-500 mt-1">
                    Your key is saved locally in this app and used for direct API calls.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={formProject}
                      onChange={(e) => setFormProject(e.target.value)}
                      placeholder="e.g. Mobile-Prototyping"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Quota Tier</label>
                    <select
                      value={formTier}
                      onChange={(e) => setFormTier(e.target.value as 'free' | 'payg')}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="free">Free Tier (15 RPM)</option>
                      <option value="payg">Pay-As-You-Go</option>
                    </select>
                  </div>
                </div>

                {/* Helpful shortcut */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-[11px] text-slate-300">Need a Google Gemini key?</span>
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Get Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onCloseAddModal}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30 transition active:scale-95"
                  >
                    Save & Activate Key
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
