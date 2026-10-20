import React, { useState, useRef } from 'react';
import { ApiKeyItem, GenerationResult, PromptItem } from '../types';
import { GEMINI_MODELS } from '../data/initialData';
import { executePromptWithGemini } from '../services/geminiService';
import { 
  Play, 
  Sparkles, 
  Sliders, 
  Settings2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Camera, 
  X, 
  Code2, 
  Clock, 
  Zap, 
  ChevronDown, 
  Terminal, 
  Maximize2, 
  RotateCcw,
  BookMarked,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlaygroundProps {
  activeKey: ApiKeyItem | null;
  initialPrompt?: PromptItem | null;
  onSaveToLibrary: (prompt: Omit<PromptItem, 'id' | 'updatedAt'>) => void;
  onOpenKeysVault: () => void;
}

export const Playground: React.FC<PlaygroundProps> = ({
  activeKey,
  initialPrompt,
  onSaveToLibrary,
  onOpenKeysVault
}) => {
  const [selectedModel, setSelectedModel] = useState<string>(initialPrompt?.model || 'gemini-2.5-flash');
  const [promptText, setPromptText] = useState<string>(initialPrompt?.promptText || 'Explain quantum computing in 3 simple bullet points suitable for a mobile app user.');
  const [systemInstruction, setSystemInstruction] = useState<string>(initialPrompt?.systemInstruction || '');
  const [showSystemBox, setShowSystemBox] = useState<boolean>(!!initialPrompt?.systemInstruction);
  
  // Parameters
  const [showParamsSheet, setShowParamsSheet] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(initialPrompt?.temperature ?? 0.7);
  const [topP, setTopP] = useState<number>(initialPrompt?.topP ?? 0.95);
  const [maxTokens, setMaxTokens] = useState<number>(initialPrompt?.maxOutputTokens ?? 2048);

  // Multimodal image state
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(initialPrompt?.sampleImage || null);
  const [selectedImageName, setSelectedImageName] = useState<string>('sample-receipt.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Execution state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);
  
  // Code Export Modal
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [exportLanguage, setExportLanguage] = useState<'python' | 'curl' | 'typescript'>('typescript');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Quick preset samples
  const sampleImages = [
    {
      name: 'Coffee Receipt',
      url: 'https://images.unsplash.com/photo-1554415707-9e49017aed81?auto=format&fit=crop&w=400&q=80',
      label: 'Receipt OCR'
    },
    {
      name: 'UI Wireframe',
      url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400&q=80',
      label: 'UI Analysis'
    }
  ];

  const currentModelInfo = GEMINI_MODELS.find(m => m.id === selectedModel) || GEMINI_MODELS[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImageBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunPrompt = async () => {
    if (!promptText.trim()) return;

    setIsGenerating(true);
    setResult(null);

    try {
      const res = await executePromptWithGemini({
        apiKey: activeKey?.key,
        model: selectedModel,
        prompt: promptText,
        systemInstruction,
        temperature,
        topP,
        maxOutputTokens: maxTokens,
        imageBase64: selectedImageBase64 || undefined
      });

      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyResponse = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const generateSnippet = () => {
    const cleanKey = activeKey?.key || 'YOUR_GEMINI_API_KEY';
    
    if (exportLanguage === 'typescript') {
      return `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: "${cleanKey}" });

async function run() {
  const response = await ai.models.generateContent({
    model: "${selectedModel}",
    contents: "${promptText.replace(/\n/g, '\\n')}",
    config: {
      temperature: ${temperature},
      topP: ${topP},
      maxOutputTokens: ${maxTokens},
      ${systemInstruction ? `systemInstruction: "${systemInstruction}",` : ''}
    }
  });

  console.log(response.text);
}

run();`;
    }

    if (exportLanguage === 'python') {
      return `from google import genai

client = genai.Client(api_key="${cleanKey}")

response = client.models.generate_content(
    model="${selectedModel}",
    contents="${promptText.replace(/\n/g, '\\n')}",
    config={
        "temperature": ${temperature},
        "top_p": ${topP},
        "max_output_tokens": ${maxTokens},
    }
)

print(response.text)`;
    }

    // cURL
    return `curl "https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${cleanKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [{"parts": [{"text": "${promptText.replace(/\n/g, '\\n')}"}]}],
    "generationConfig": {
      "temperature": ${temperature},
      "topP": ${topP},
      "maxOutputTokens": ${maxTokens}
    }
  }'`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-4 pb-28">
      
      {/* Playground Mobile Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md space-y-3">
        
        {/* Model Selector & Parameters Trigger */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Model Dropdown */}
          <div className="relative flex-1">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-100 focus:outline-none focus:border-blue-500 transition"
            >
              {GEMINI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.displayName} ({m.speed})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Model Tuning Button */}
          <button
            onClick={() => setShowParamsSheet(!showParamsSheet)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition active:scale-95 flex-shrink-0 ${
              showParamsSheet 
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' 
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden xs:inline">Temp: {temperature}</span>
          </button>

          {/* System Prompt Toggle */}
          <button
            onClick={() => setShowSystemBox(!showSystemBox)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition active:scale-95 flex-shrink-0 ${
              showSystemBox 
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' 
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle System Instructions"
          >
            System
          </button>
        </div>

        {/* Model Spec Pills */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${currentModelInfo.badgeColor}`}>
              {currentModelInfo.speed}
            </span>
            <span>{currentModelInfo.contextWindow}</span>
          </div>

          <div className="flex items-center space-x-1 text-slate-500">
            <span>Key:</span>
            <span className="font-mono text-slate-300 truncate max-w-[100px]">
              {activeKey ? activeKey.name : 'Sandbox Mode'}
            </span>
          </div>
        </div>

        {/* Expandable Parameters Drawer */}
        <AnimatePresence>
          {showParamsSheet && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-2 border-t border-slate-800/80 space-y-3 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Temperature</span>
                    <span className="font-mono text-blue-400 font-semibold">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.05}
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Deterministic (0.0)</span>
                    <span>Balanced (0.7)</span>
                    <span>Creative (1.5)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Max Tokens</span>
                    <span className="font-mono text-blue-400 font-semibold">{maxTokens}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[512, 1024, 2048, 4096].map((tokens) => (
                      <button
                        key={tokens}
                        type="button"
                        onClick={() => setMaxTokens(tokens)}
                        className={`py-1 rounded-lg text-[11px] font-mono font-medium border transition ${
                          maxTokens === tokens
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {tokens}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expandable System Instructions Box */}
        <AnimatePresence>
          {showSystemBox && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-2 border-t border-slate-800/80 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" /> System Instructions
                </span>
                <button
                  onClick={() => setSystemInstruction('')}
                  className="text-slate-500 hover:text-slate-300 text-[11px]"
                >
                  Clear
                </button>
              </div>
              <textarea
                rows={2}
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                placeholder="Give Gemini high-level behavioral directives or output schemas..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Main Prompt Input Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        
        {/* Multimodal Preview Thumbnail (if attached) */}
        {selectedImageBase64 && (
          <div className="relative inline-block rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-1">
            <img 
              src={selectedImageBase64} 
              alt="Attached attachment" 
              className="w-24 h-24 object-cover rounded-lg"
            />
            <button
              onClick={() => setSelectedImageBase64(null)}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/80 text-white hover:bg-black transition"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="block text-[10px] text-slate-400 font-mono mt-1 text-center truncate max-w-[96px]">
              {selectedImageName}
            </span>
          </div>
        )}

        {/* Text Area */}
        <div className="relative">
          <textarea
            rows={5}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Type your prompt here or attach multimodal media..."
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans resize-y leading-relaxed"
          />
        </div>

        {/* Input Tools & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          
          {/* Multimodal attachments trigger */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition active:scale-95"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Attach Image</span>
            </button>

            {/* Quick Sample Image Pills */}
            <div className="hidden xs:flex items-center space-x-1 text-xs">
              {sampleImages.map((samp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedImageBase64(samp.url);
                    setSelectedImageName(samp.name);
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-[10.5px] text-slate-400 hover:text-slate-200 transition"
                >
                  +{samp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setPromptText('')}
              className="px-2.5 py-2 rounded-xl text-slate-400 hover:text-white text-xs transition"
            >
              Clear
            </button>

            <button
              onClick={handleRunPrompt}
              disabled={isGenerating || !promptText.trim()}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>Run Prompt</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Output Terminal / Response Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/95 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl space-y-0"
        >
          {/* Result Header Bar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">Model Response</span>
              <span className="font-mono text-slate-400 text-[10px]">
                ({result.model})
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setShowCodeModal(true)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
              >
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden xs:inline">Export Code</span>
              </button>

              <button
                onClick={handleCopyResponse}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
              >
                {copiedResponse ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Content Body */}
          <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-slate-100 whitespace-pre-wrap leading-relaxed select-text font-mono bg-slate-900/50">
            {result.text}
          </div>

          {/* Performance HUD Footer */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <Clock className="w-3 h-3" /> {result.latencyMs}ms
              </span>
              <span>Prompt: <strong className="text-slate-200">{result.inputTokens}</strong> tok</span>
              <span>Output: <strong className="text-slate-200">{result.outputTokens}</strong> tok</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onSaveToLibrary({
                    title: `Run: ${promptText.substring(0, 30)}...`,
                    description: result.text.substring(0, 70),
                    category: 'general',
                    systemInstruction,
                    promptText,
                    model: selectedModel,
                    temperature,
                    topP,
                    maxOutputTokens: maxTokens,
                    isFavorite: false,
                    tags: ['Playground']
                  });
                }}
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <BookMarked className="w-3 h-3" />
                <span>Save to Library</span>
              </button>
            </div>
          </div>

        </motion.div>
      )}

      {/* Code Export Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#161a22] border border-slate-700/80 rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <h3 className="font-bold text-sm text-white">Google GenAI Code Snippet</h3>
                </div>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Language Selector */}
              <div className="flex gap-2">
                {(['typescript', 'python', 'curl'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setExportLanguage(lang)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize border transition ${
                      exportLanguage === lang
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'typescript' ? 'TypeScript SDK' : lang === 'python' ? 'Python SDK' : 'cURL'}
                  </button>
                ))}
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3">
                <pre className="text-[11px] font-mono text-slate-200 overflow-x-auto whitespace-pre leading-relaxed max-h-60">
                  {generateSnippet()}
                </pre>
                <button
                  onClick={handleCopyCode}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition shadow"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-medium text-xs hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
