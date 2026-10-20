import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Globe, 
  Smartphone, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  Sparkles, 
  Compass, 
  Info, 
  Zap, 
  Monitor,
  Camera
} from 'lucide-react';

export const StudioPortal: React.FC = () => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [targetType, setTargetType] = useState<'studio' | 'app'>('studio');
  const [copied, setCopied] = useState<boolean>(false);

  const studioUrl = 'https://aistudio.google.com';
  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://aistudio.google.com';
  const activeUrl = targetType === 'studio' ? studioUrl : currentAppUrl;

  useEffect(() => {
    QRCode.toDataURL(activeUrl, {
      width: 260,
      margin: 2,
      color: { dark: '#0a0f1d', light: '#ffffff' }
    })
      .then(url => setQrUrl(url))
      .catch(err => console.error(err));
  }, [activeUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-28">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Google AI Studio Mobile Portal</h2>
            <p className="text-xs text-slate-300">Connect your phone to Google AI Studio in seconds</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Google AI Studio is fully accessible on mobile devices via standard mobile web browsers (Chrome, Safari, Firefox). Use this screen to scan QR codes, access developer documentation, or install this companion as a Progressive Web App on your home screen.
        </p>

        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Google AI Studio Web</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
          >
            <span>Get Gemini API Keys</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Instant QR Code Connect */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 text-center">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-left">
          <div className="flex items-center space-x-2">
            <QrCode className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Scan with Phone Camera</h3>
          </div>
          <span className="text-xs text-slate-400">Instant Access</span>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 max-w-xs mx-auto text-xs font-semibold">
          <button
            onClick={() => setTargetType('studio')}
            className={`py-1.5 rounded-lg transition ${
              targetType === 'studio' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Google AI Studio Web
          </button>
          <button
            onClick={() => setTargetType('app')}
            className={`py-1.5 rounded-lg transition ${
              targetType === 'app' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            This Mobile App
          </button>
        </div>

        {/* QR image */}
        <div className="p-3 bg-white rounded-2xl inline-block shadow-inner mx-auto">
          {qrUrl ? (
            <img src={qrUrl} alt="QR Code" className="w-52 h-52 object-contain" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
              Generating...
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400">
          Point your iPhone or Android camera at the code to open <span className="font-mono text-slate-300">{activeUrl}</span>
        </p>

        {/* Copy bar */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs max-w-sm mx-auto">
          <span className="truncate text-slate-300 font-mono flex-1 text-left select-all">
            {activeUrl}
          </span>
          <button
            onClick={handleCopy}
            className="ml-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Guide: Add to Home Screen */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Add to Phone Home Screen (PWA Walkthrough)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-blue-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> iPhone / iPad (Safari)
            </span>
            <ol className="text-slate-400 space-y-1 list-decimal list-inside text-[11.5px] leading-relaxed">
              <li>Open <strong>aistudio.google.com</strong> in Safari.</li>
              <li>Tap the <strong>Share button</strong> (square with arrow up).</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
              <li>Tap <strong>Add</strong> in the top-right. An icon appears!</li>
            </ol>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Android (Google Chrome)
            </span>
            <ol className="text-slate-400 space-y-1 list-decimal list-inside text-[11.5px] leading-relaxed">
              <li>Open <strong>aistudio.google.com</strong> in Chrome.</li>
              <li>Tap the <strong>3 vertical dots (⋮)</strong> menu.</li>
              <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
              <li>Launch anytime with zero browser address bar interference!</li>
            </ol>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start space-x-2.5 text-xs text-blue-200">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Desktop Site Switcher:</strong> When designing complex JSON structures or multi-turn system prompts on mobile, enable <em>"Desktop site"</em> in your mobile browser settings to access full dual-pane view.
          </p>
        </div>
      </div>

    </div>
  );
};
