import { ApiKeyItem, PromptItem, GeminiModelInfo } from '../types';

export const GEMINI_MODELS: GeminiModelInfo[] = [
  {
    id: 'gemini-2.5-flash',
    displayName: 'Gemini 2.5 Flash',
    description: 'Next-gen lightning speed model with sub-second latency and strong multimodal reasoning.',
    contextWindow: '1,000,000 tokens',
    recommendedFor: 'Mobile apps, high volume, real-time responses',
    speed: 'Ultra Fast',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    supportsMultimodal: true,
    costPer1MTokens: { input: '$0.075', output: '$0.30' }
  },
  {
    id: 'gemini-2.5-pro',
    displayName: 'Gemini 2.5 Pro',
    description: 'State of the art reasoning, complex code generation, and deep scientific analysis.',
    contextWindow: '2,000,000 tokens',
    recommendedFor: 'Complex reasoning, math, intricate codebases',
    speed: 'Deep Reasoning',
    badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    supportsMultimodal: true,
    costPer1MTokens: { input: '$1.25', output: '$5.00' }
  },
  {
    id: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    description: 'Workhorse multimodal model tuned for fast, cost-efficient workloads.',
    contextWindow: '1,000,000 tokens',
    recommendedFor: 'Summaries, chat, classification',
    speed: 'Fast',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    supportsMultimodal: true,
    costPer1MTokens: { input: '$0.075', output: '$0.30' }
  },
  {
    id: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro',
    description: 'Deep multimodal understanding across hours of audio and video.',
    contextWindow: '2,000,000 tokens',
    recommendedFor: 'Long-document analysis and video search',
    speed: 'Deep Reasoning',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    supportsMultimodal: true,
    costPer1MTokens: { input: '$1.25', output: '$5.00' }
  }
];

export const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Primary Mobile Dev Key',
    key: 'AIzaSyA89vK2_qL9pMn0Xz7W1eRt4Yu6Op3IaBc',
    project: 'Studio-Mobile-App-2026',
    createdAt: '2026-03-12',
    lastUsed: '2 mins ago',
    tier: 'free',
    isActive: true,
    notes: 'Configured for rapid mobile prototyping and testing.',
    usageCount: 142,
    status: 'valid',
    statusMessage: 'Ready (15 RPM / 1,500 RPD Free Quota)'
  },
  {
    id: 'key-2',
    name: 'Production Workspace API',
    key: 'AIzaSyDb49kL82n0XqM1p7W3eRt6Yu9Op2IaZxE',
    project: 'Enterprise-Prod-Cluster',
    createdAt: '2026-01-20',
    lastUsed: '1 hour ago',
    tier: 'payg',
    isActive: false,
    notes: 'Pay-as-you-go billing with tier 2 quotas.',
    usageCount: 1894,
    status: 'untested',
    statusMessage: 'Pay-as-you-go quota available'
  }
];

export const INITIAL_PROMPTS: PromptItem[] = [
  {
    id: 'prompt-1',
    title: 'JSON Structured Entity Extractor',
    description: 'Converts unstructured text or receipts into validated, typed JSON.',
    category: 'extraction',
    systemInstruction: 'You are an ultra-precise JSON extraction engine. Output strictly valid JSON without markdown wrapping or commentary.',
    promptText: 'Extract the items, total amount, taxes, merchant name, and date from the following receipt:\n\n"Blue Bottle Coffee, 10/18/2026. 1x Oat Latte $6.50, 1x Almond Croissant $4.75. Subtotal: $11.25. Tax: $1.01. Total: $12.26. Paid with Apple Pay."',
    model: 'gemini-2.5-flash',
    temperature: 0.1,
    topP: 0.95,
    maxOutputTokens: 1024,
    isFavorite: true,
    tags: ['JSON', 'Production', 'Extraction'],
    updatedAt: 'Today at 06:40'
  },
  {
    id: 'prompt-2',
    title: 'Multimodal Image Inspector',
    description: 'Deep visual breakdown of diagrams, code screenshots, or objects.',
    category: 'vision',
    systemInstruction: 'Analyze visual inputs with extreme attention to detail, identifying UI components, architecture, and potential bugs.',
    promptText: 'Describe this UI design system screenshot. Identify the typography hierarchy, color palette hex codes, spacing grid, and accessibility contrast ratios.',
    model: 'gemini-2.5-flash',
    temperature: 0.4,
    topP: 0.95,
    maxOutputTokens: 2048,
    isFavorite: true,
    tags: ['Vision', 'Design', 'UI/UX'],
    updatedAt: 'Yesterday',
    sampleImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prompt-3',
    title: 'TypeScript Refactor & Optimizer',
    description: 'Modernizes TypeScript code, improves type safety, and removes bottlenecks.',
    category: 'code',
    systemInstruction: 'You are a Principal Software Engineer. Provide modern TypeScript code with zero unnecessary dependencies and immaculate type safety.',
    promptText: 'Refactor this async data fetcher to use AbortController with automatic retry with exponential backoff and typed error handling:\n\nasync function loadData(url) {\n  const res = await fetch(url);\n  return res.json();\n}',
    model: 'gemini-2.5-pro',
    temperature: 0.2,
    topP: 0.9,
    maxOutputTokens: 2048,
    isFavorite: false,
    tags: ['TypeScript', 'Optimization', 'Clean Code'],
    updatedAt: '3 days ago'
  },
  {
    id: 'prompt-4',
    title: 'Mobile Friendly Micro-Copy Writer',
    description: 'Generates concise, punchy mobile UX microcopy and push notifications.',
    category: 'creative',
    systemInstruction: 'You write concise, warm, helpful microcopy for mobile apps following Google Material Design content guidelines.',
    promptText: 'Write 3 variations of push notifications informing users that their background AI video generation is ready to view. Keep each under 60 characters.',
    model: 'gemini-2.5-flash',
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 512,
    isFavorite: false,
    tags: ['UX Writing', 'Copywriting', 'Mobile'],
    updatedAt: 'Oct 15'
  }
];

export const PROMPT_TEMPLATES = [
  {
    title: 'Zero-Shot JSON Schema',
    category: 'Structured Output',
    description: 'Enforce schema conformance for API pipelines',
    prompt: 'Convert the following input into a strict JSON object conforming to schema { "title": string, "summary": string, "key_points": string[], "sentiment": "positive"|"neutral"|"negative" }:\n\n[INPUT TEXT HERE]',
    system: 'Return only valid raw JSON. Never include markdown code fences or conversational filler.',
    model: 'gemini-2.5-flash'
  },
  {
    title: 'Camera Photo Receipt Scanner',
    category: 'Multimodal',
    description: 'Extract line items and tax breakdown from physical photo',
    prompt: 'Examine this receipt photo. List all purchased line items with unit prices, quantity, discount applied, tax rate, and final paid amount.',
    system: 'You are a receipt OCR specialist. If any line item is smudged or blurry, denote with [unclear] but provide best guess.',
    model: 'gemini-2.5-flash'
  },
  {
    title: 'Code Reviewer & Security Audit',
    category: 'Developer',
    description: 'Spot potential vulnerabilities, leaks, and race conditions',
    prompt: 'Perform a security audit on the following snippet. Highlight injection vulnerabilities, secret leaks, and memory bottlenecks with proposed fixes:\n\n[PASTE CODE HERE]',
    system: 'You are a Senior Security Engineer reviewing pull requests.',
    model: 'gemini-2.5-pro'
  },
  {
    title: 'Executive Briefing & Action Items',
    category: 'Productivity',
    description: 'Turn lengthy transcripts or emails into immediate to-dos',
    prompt: 'Read this meeting notes draft and provide:\n1. 3-bullet executive summary\n2. Key decisions made\n3. Action items table with Owner and Deadline columns.\n\n[PASTE NOTES]',
    system: 'Be crisp, factual, and direct.',
    model: 'gemini-2.5-flash'
  }
];
