import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

// Patterns that could indicate prompt injection attempts
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

@Injectable()
export class AiService {
  private readonly anthropic: Anthropic;
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly config: ConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.config.get<string>('anthropic.apiKey'),
    });
  }

  // Sanitizes user input before interpolation into AI prompts
  private sanitize(input: string, maxLength = MAX_FIELD_LENGTH): string {
    if (!input || typeof input !== 'string') return '';

    const trimmed = input.trim().slice(0, maxLength);

    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(trimmed)) {
        this.logger.warn(`Possible prompt injection attempt detected: "${trimmed.slice(0, 80)}"`);
        throw new Error('El contenido ingresado contiene texto no permitido');
      }
    }

    // Escape characters that could break prompt structure
    return trimmed
      .replace(/`/g, "'")
      .replace(/\n{3,}/g, '\n\n'); // collapse excessive newlines
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
    "genders": ["all"|"male"|"female"],
    "interests": ["interés1", "interés2", "interés3"]
  },
  "format": "9_16"|"1_1"|"4_5",
  "styleNotes": "notas sobre estilo visual y edición recomendados",
  "whatsappMessage": "mensaje inicial automático cuando el lead hace click",
  "hooks_variants": ["hook alternativo 1", "hook alternativo 2"],
  "reasoning": "breve explicación de la estrategia"
}

Respondé SOLO con el JSON válido, sin texto adicional.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (response.content[0] as any).text;
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
    "type": "scale"|"pause"|"optimize"|"info"|"warning",
    "title": "título corto del insight",
    "detail": "explicación concreta con números",
    "action": "acción recomendada específica",
    "priority": "high"|"medium"|"low"
  }
]

Máximo 6 insights. Ordenalos por prioridad. SOLO JSON, sin texto adicional.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (response.content[0] as any).text;
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
  "score": 0-100,
  "status": "good"|"needs_work"|"critical",
  "suggestions": [
    {
      "type": "budget"|"creative"|"audience"|"copy"|"schedule",
      "title": "título corto",
      "description": "descripción concreta",
      "expected_improvement": "mejora estimada en %"
    }
  ],
  "new_hook": "nuevo hook sugerido si el CTR es bajo",
  "audience_tweak": "ajuste de audiencia sugerido"
}

SOLO JSON.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (response.content[0] as any).text;
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

    const response = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Sos un experto en publicidad viral de Meta Ads para el mercado latinoamericano.
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

Respondé SOLO con el script, sin etiquetas ni explicaciones.`,
      }],
    });

    const text = (response.content[0] as any).text.trim();
    return { text };
  }

  // ── Generate creative prompt ──────────────────────────────────────────────

  async generateCreativePrompt(product: string, style: string, format: string) {
    const safeProduct = this.sanitize(product, 100);
    const safeStyle = this.sanitize(style, 100);
    const safeFormat = this.sanitize(format, 10);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Generá un prompt para DALL-E para crear una imagen publicitaria de Meta Ads.
Producto: ${safeProduct}
Estilo: ${safeStyle}
Formato: ${safeFormat}
El prompt debe ser en inglés, fotorrealista, con buena iluminación y estética premium.
SOLO el prompt, sin explicaciones.`,
      }],
    });

    return (response.content[0] as any).text.trim();
  }
}
