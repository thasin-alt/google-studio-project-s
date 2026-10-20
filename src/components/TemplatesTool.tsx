import React, { useState } from 'react';
import { PROMPT_TEMPLATES, GEMINI_MODELS } from '../data/initialData';
import { PromptItem } from '../types';
import { 
  Sparkles, 
  Calculator, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  DollarSign, 
  Cpu, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface TemplatesToolProps {
  onLoadTemplate: (template: typeof PROMPT_TEMPLATES[0]) => void;
}

export const TemplatesTool: React.FC<TemplatesToolProps> = ({ onLoadTemplate }) => {
  // Token & Cost Calculator state
  const [inputTokens, setInputTokens] = useState<number>(1500);
  const [outputTokens, setOutputTokens] = useState<number>(450);
  const [monthlyRequests, setMonthlyRequests] = useState<number>(10000);

  // Pricing constants (per 1M tokens)
  const flashInputCost = 0.075;
  const flashOutputCost = 0.30;
  const proInputCost = 1.25;
  const proOutputCost = 5.00;

  const totalInputTokensMonthly = (inputTokens * monthlyRequests) / 1_000_000;
  const totalOutputTokensMonthly = (outputTokens * monthlyRequests) / 1_000_000;

  const flashMonthlyCost = (totalInputTokensMonthly * flashInputCost) + (totalOutputTokensMonthly * flashOutputCost);
  const proMonthlyCost = (totalInputTokensMonthly * proInputCost) + (totalOutputTokensMonthly * proOutputCost);

  return (
    <div className="space-y-6 pb-28">
      
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md space-y-1">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span>Templates & Cost Estimator</span>
        </h2>
        <p className="text-xs text-slate-400">
          Google-engineered prompt patterns and real-time Gemini token economics.
        </p>
      </div>

      {/* Templates Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Battle-Tested Prompt Templates
          </span>
          <span className="text-[11px] text-blue-400 font-medium">Ready to deploy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROMPT_TEMPLATES.map((tmpl, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 transition-all group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{tmpl.model}</span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 line-clamp-2">
                {tmpl.prompt}
              </div>

              <button
                onClick={() => onLoadTemplate(tmpl)}
                className="w-full inline-flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold transition active:scale-95"
              >
                <span>Open in Playground</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Token & Cost Calculator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Mobile Quota & Cost Calculator</h3>
              <p className="text-[11px] text-slate-400">Calculate costs for Gemini 2.5 Flash vs 2.5 Pro</p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Free Tier: $0
          </span>
        </div>

        {/* Sliders */}
        <div className="space-y-3.5 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Input Tokens per request</span>
              <span className="font-mono text-blue-400 font-bold">{inputTokens.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={inputTokens}
              onChange={(e) => setInputTokens(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Output Tokens per request</span>
              <span className="font-mono text-blue-400 font-bold">{outputTokens.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min={50}
              max={4000}
              step={50}
              value={outputTokens}
              onChange={(e) => setOutputTokens(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Monthly Requests</span>
              <span className="font-mono text-indigo-400 font-bold">{monthlyRequests.toLocaleString()} req/mo</span>
            </div>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={monthlyRequests}
              onChange={(e) => setMonthlyRequests(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        {/* Monthly Estimate Cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Gemini 2.5 Flash</span>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
              ${flashMonthlyCost.toFixed(2)}
              <span className="text-[10px] text-slate-500 font-normal"> /mo</span>
            </div>
            <p className="text-[10.5px] text-slate-500">
              Free under 1,500 RPD quota
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Gemini 2.5 Pro</span>
            <div className="text-lg sm:text-xl font-extrabold text-violet-400 font-mono">
              ${proMonthlyCost.toFixed(2)}
              <span className="text-[10px] text-slate-500 font-normal"> /mo</span>
            </div>
            <p className="text-[10.5px] text-slate-500">
              Includes 2M tokens context
            </p>
          </div>
        </div>

      </div>

      {/* Model Spec Comparison */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>Gemini Model Family Matrix</span>
        </h3>
        <div className="space-y-2 text-xs">
          {GEMINI_MODELS.map((m) => (
            <div key={m.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{m.displayName}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-semibold border ${m.badgeColor}`}>
                    {m.speed}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>
              </div>
              <div className="text-right sm:flex-shrink-0 text-[11px] font-mono text-slate-400">
                <span className="text-slate-300 block">{m.contextWindow}</span>
                <span className="text-emerald-400 font-semibold">{m.costPer1MTokens.input} in / {m.costPer1MTokens.output} out</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
