import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+instructions/i,
  /system\s*prompt/i,
  /you\s+are\s+now/i,
  /forget\s+(everything|all|your)/i,
  /\[INST\]|\[\/INST\]|<\|im_start\|>|<\|im_end\|>/,
  /act\s+as\s+(a\s+)?different/i,
  /disregard\s+(all\s+)?previous/i,
];

const MAX_FIELD_LENGTH = 500;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_FAST = 'llama-3.1-8b-instant';
const MODEL_SMART = 'llama-3.3-70b-versatile';

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly enabled: boolean;
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('groq.apiKey') || process.env.GROQ_API_KEY || '';
    this.enabled = !!this.apiKey;
    if (!this.enabled) {
      this.logger.warn('⚠️  GROQ_API_KEY not set — AI features disabled');
    } else {
      this.logger.log('🤖 AiService initialized with Groq (Llama 3)');
    }
  }

  private ensureEnabled() {
    if (!this.enabled) throw new Error('IA no disponible — configurá GROQ_API_KEY en Railway → Variables');
  }

  private sanitize(input: string, maxLength = MAX_FIELD_LENGTH): string {
    if (!input || typeof input !== 'string') return '';
    const trimmed = input.trim().slice(0, maxLength);
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(trimmed)) {
        this.logger.warn(`Possible prompt injection attempt: "${trimmed.slice(0, 80)}"`);
        throw new Error('El contenido ingresado contiene texto no permitido');
      }
    }
    return trimmed.replace(/`/g, "'").replace(/\n{3,}/g, '\n\n');
  }

  private async chat(model: string, prompt: string, maxTokens = 1000): Promise<string> {
    this.ensureEnabled();
    const res = await axios.post(
      GROQ_URL,
      {
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30_000,
      },
    );
    return res.data.choices[0].message.content.trim();
  }

  // ── Analyze product and generate campaign strategy ────────────────────────

  async analyzeCampaign(input: {
    productName: string;
    description: string;
    price?: number;
    targetAudience?: string;
    objective: string;
  }) {
    const productName = this.sanitize(input.productName, 100);
    const description = this.sanitize(input.description, 400);
    const objective = this.sanitize(input.objective, 50);

    const prompt = `Sos un experto en publicidad digital de Meta Ads para el mercado latinoamericano.
IMPORTANTE: Escribí TODO en español correcto, sin errores de ortografía ni palabras inventadas.
Analizá este producto y generá una estrategia de campaña completa.

Producto: ${productName}
Descripción: ${description}
Precio: ${input.price ? `$${input.price}` : 'No especificado'}
Objetivo: ${objective}

Generá una estrategia completa en JSON con esta estructura exacta:
{
  "hook": "gancho principal viral (máx 15 palabras)",
  "headline": "título del anuncio",
  "body": "texto principal del anuncio (2-3 oraciones, urgencia y beneficio)",
  "cta": "texto del botón de acción",
  "audience": {
    "description": "descripción del público ideal",
    "age_min": 18,
    "age_max": 45,
    "genders": ["all"],
    "interests": ["interés1", "interés2", "interés3"]
  },
  "format": "9_16",
  "styleNotes": "notas sobre estilo visual y edición recomendados",
  "whatsappMessage": "mensaje inicial automático cuando el lead hace click",
  "hooks_variants": ["hook alternativo 1", "hook alternativo 2"],
  "reasoning": "breve explicación de la estrategia"
}

Respondé SOLO con el JSON válido, sin texto adicional ni bloques de código.`;

    const raw = await this.chat(MODEL_SMART, prompt, 1000);
    try {
      return JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      this.logger.error('Failed to parse AI response:', raw);
      throw new Error('La IA no pudo generar la estrategia. Intentá nuevamente.');
    }
  }

  // ── Generate daily report insights ───────────────────────────────────────

  async generateReportInsights(campaignsData: any[], userId: string) {
    const prompt = `Sos un analista de campañas de Meta Ads. Analizá estos datos y generá insights accionables.

Campañas:
${JSON.stringify(campaignsData, null, 2)}

Generá un array JSON de insights con esta estructura:
[
  {
    "type": "scale",
    "title": "título corto del insight",
    "detail": "explicación concreta con números",
    "action": "acción recomendada específica",
    "priority": "high"
  }
]

Máximo 6 insights. Ordenalos por prioridad. SOLO JSON válido, sin texto adicional ni bloques de código.`;

    const raw = await this.chat(MODEL_SMART, prompt, 1000);
    try {
      return JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      return [];
    }
  }

  // ── Generate optimization suggestions ─────────────────────────────────────

  async optimizeCampaign(campaign: any) {
    const prompt = `Analizá esta campaña de Meta Ads y sugerí optimizaciones específicas.

Campaña: ${JSON.stringify(campaign, null, 2)}

Generá sugerencias en JSON:
{
  "score": 75,
  "status": "needs_work",
  "suggestions": [
    {
      "type": "budget",
      "title": "título corto",
      "description": "descripción concreta",
      "expected_improvement": "15%"
    }
  ],
  "new_hook": "nuevo hook sugerido si el CTR es bajo",
  "audience_tweak": "ajuste de audiencia sugerido"
}

SOLO JSON válido, sin texto adicional ni bloques de código.`;

    const raw = await this.chat(MODEL_SMART, prompt, 800);
    try {
      return JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      return { score: 50, status: 'needs_work', suggestions: [] };
    }
  }

  // ── Generate video script for creatives ──────────────────────────────────

  async generateScript(product: string, style: string, format: string): Promise<{ text: string }> {
    const safeProduct = this.sanitize(product, 150);
    const safeStyle = this.sanitize(style, 100);
    const safeFormat = this.sanitize(format, 10);

    const prompt = `Sos un experto en publicidad viral de Meta Ads para el mercado latinoamericano.
Generá un script corto para un video publicitario de ${safeFormat}.

Producto: ${safeProduct}
Estilo: ${safeStyle}
Formato: ${safeFormat}

El script debe:
- Empezar con un hook poderoso (primera línea = gancho viral de máx 8 palabras)
- Durar 15-30 segundos cuando se lee en voz alta
- Tener urgencia y beneficio claro
- Terminar con CTA para WhatsApp
- Estar en español rioplatense

Respondé SOLO con el script, sin etiquetas ni explicaciones.`;

    const text = await this.chat(MODEL_FAST, prompt, 400);
    return { text };
  }

  // ── Analyze content and extract pattern fields ────────────────────────────

  async analyzePattern(content: string, sourceUrl?: string): Promise<{
    hook?: string; style?: string; platform?: string; tone?: string;
    visualNotes?: string; cta?: string; audience?: string; score?: number; source?: string; type?: string;
  }> {
    const safeContent = this.sanitize(content, 800);

    const isUrl = /^https?:\/\//i.test(safeContent);
    let detectedPlatform = 'reels';
    if (isUrl) {
      if (safeContent.includes('tiktok')) detectedPlatform = 'tiktok';
      else if (safeContent.includes('youtube')) detectedPlatform = 'youtube';
      else if (safeContent.includes('facebook') || safeContent.includes('meta')) detectedPlatform = 'feed';
    }

    const contentBlock = isUrl
      ? `URL de contenido de ${detectedPlatform}: ${safeContent}\n\nNo podés acceder a la URL, pero basándote en el tipo de plataforma, generá un patrón viral típico de alto rendimiento para esa plataforma en el mercado latinoamericano.`
      : `Contenido del anuncio:\n${safeContent}${sourceUrl ? `\n\nURL fuente: ${sourceUrl}` : ''}`;

    const prompt = `Sos experto en publicidad viral de Meta Ads para el mercado latinoamericano. Analizá el siguiente contenido y extraé los patrones clave en JSON.

${contentBlock}

Respondé SOLO con este JSON válido (sin texto adicional ni bloques de código):
{
  "hook": "el gancho principal en español rioplatense (máx 80 chars)",
  "style": "estilo visual",
  "platform": "reels",
  "tone": "urgencia",
  "visualNotes": "notas sobre edición o visual recomendado",
  "cta": "llamada a la acción",
  "audience": "audiencia objetivo",
  "score": 80,
  "type": "video"
}`;

    const raw = await this.chat(MODEL_FAST, prompt, 400);
    try {
      return JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      const firstLine = safeContent.split(/[.!\n]/)[0]?.slice(0, 80) ?? 'Hook extraído';
      return { hook: firstLine, score: 75, platform: detectedPlatform, type: 'video' };
    }
  }

  // ── Generate creative prompt ──────────────────────────────────────────────

  async generateCreativePrompt(product: string, style: string, format: string) {
    const safeProduct = this.sanitize(product, 100);
    const safeStyle = this.sanitize(style, 100);
    const safeFormat = this.sanitize(format, 10);

    const prompt = `Generá un prompt para crear una imagen publicitaria de Meta Ads.
Producto: ${safeProduct}
Estilo: ${safeStyle}
Formato: ${safeFormat}
El prompt debe ser en inglés, fotorrealista, con buena iluminación y estética premium.
SOLO el prompt, sin explicaciones.`;

    return this.chat(MODEL_FAST, prompt, 300);
  }
}
