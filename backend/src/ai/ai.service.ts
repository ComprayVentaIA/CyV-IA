import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

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
  private readonly client: Anthropic | null = null;
  private readonly enabled: boolean;
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('anthropic.apiKey') || process.env.ANTHROPIC_API_KEY || '';
    this.enabled = !!apiKey;
    if (this.enabled) {
      this.client = new Anthropic({ apiKey });
      this.logger.log('🤖 AiService initialized with Claude (Anthropic)');
    } else {
      this.logger.warn('⚠️  ANTHROPIC_API_KEY not set — AI features disabled');
    }
  }

  private getClient(): Anthropic {
    if (!this.client) throw new Error('IA no disponible — configurá ANTHROPIC_API_KEY en Railway → Variables');
    return this.client;
  }

  private sanitize(input: string, maxLength = MAX_FIELD_LENGTH): string {
    if (!input || typeof input !== 'string') return '';
    const trimmed = input.trim().slice(0, maxLength);
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(trimmed)) {
        this.logger.warn(`Possible prompt injection: "${trimmed.slice(0, 80)}"`);
        throw new Error('El contenido ingresado contiene texto no permitido');
      }
    }
    return trimmed.replace(/`/g, "'").replace(/\n{3,}/g, '\n\n');
  }

  private async ask(model: string, prompt: string, maxTokens = 1000): Promise<string> {
    const res = await this.getClient().messages.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });
    return (res.content[0] as any).text.trim();
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
    const objective   = this.sanitize(input.objective, 50);

    const prompt = `Sos un experto en publicidad digital de Meta Ads para el mercado latinoamericano.
Escribí TODO en español correcto, sin errores ortográficos.
Analizá este producto y generá una estrategia de campaña completa.

Producto: ${productName}
Descripción: ${description}
Precio: ${input.price ? `$${input.price}` : 'No especificado'}
Objetivo: ${objective}

Respondé SOLO con este JSON válido, sin texto adicional:
{
  "hook": "gancho viral en español correcto (máx 12 palabras)",
  "headline": "título del anuncio",
  "body": "texto principal (2-3 oraciones con urgencia y beneficio)",
  "cta": "texto del botón",
  "audience": {
    "description": "descripción del público ideal",
    "age_min": 18,
    "age_max": 45,
    "genders": ["all"],
    "interests": ["interés1", "interés2", "interés3"]
  },
  "format": "9_16",
  "styleNotes": "notas sobre estilo visual recomendado",
  "whatsappMessage": "mensaje automático cuando el lead hace click",
  "hooks_variants": ["variante 1", "variante 2"],
  "reasoning": "breve explicación de la estrategia"
}`;

    const raw = await this.ask('claude-sonnet-4-6', prompt, 1000);
    try {
      return JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      this.logger.error('Failed to parse Claude response:', raw);
      throw new Error('La IA no pudo generar la estrategia. Intentá nuevamente.');
    }
  }

  // ── Generate daily report insights ───────────────────────────────────────

  async generateReportInsights(campaignsData: any[], userId: string) {
    const prompt = `Sos un analista de campañas de Meta Ads. Analizá estos datos y generá insights accionables en español correcto.

Campañas: ${JSON.stringify(campaignsData, null, 2)}

Respondé SOLO con un array JSON (máx 6 insights):
[{
  "type": "scale",
  "title": "título corto",
  "detail": "explicación con números",
  "action": "acción específica",
  "priority": "high"
}]`;

    const raw = await this.ask('claude-sonnet-4-6', prompt, 1000);
    try { return JSON.parse(raw.replace(/```json|```/g, '').trim()); }
    catch { return []; }
  }

  // ── Generate optimization suggestions ─────────────────────────────────────

  async optimizeCampaign(campaign: any) {
    const prompt = `Analizá esta campaña de Meta Ads y sugerí optimizaciones. Escribí en español correcto.

Campaña: ${JSON.stringify(campaign, null, 2)}

Respondé SOLO con JSON:
{
  "score": 75,
  "status": "needs_work",
  "suggestions": [{
    "type": "budget",
    "title": "título corto",
    "description": "descripción concreta",
    "expected_improvement": "15%"
  }],
  "new_hook": "nuevo hook sugerido",
  "audience_tweak": "ajuste de audiencia"
}`;

    const raw = await this.ask('claude-sonnet-4-6', prompt, 800);
    try { return JSON.parse(raw.replace(/```json|```/g, '').trim()); }
    catch { return { score: 50, status: 'needs_work', suggestions: [] }; }
  }

  // ── Generate video script ─────────────────────────────────────────────────

  async generateScript(product: string, style: string, format: string): Promise<{ text: string }> {
    const safeProduct = this.sanitize(product, 150);
    const safeStyle   = this.sanitize(style, 100);
    const safeFormat  = this.sanitize(format, 10);

    const prompt = `Sos un experto en publicidad viral de Meta Ads para el mercado latinoamericano.
Escribí en español rioplatense correcto, sin errores ortográficos.
Generá un script corto para un video publicitario.

Producto: ${safeProduct}
Estilo: ${safeStyle}
Formato: ${safeFormat}

El script debe:
- Empezar con un hook poderoso (máx 8 palabras, en español correcto)
- Durar 15-30 segundos en voz alta
- Tener urgencia y beneficio claro
- Terminar con CTA para WhatsApp

Respondé SOLO con el script, sin etiquetas ni explicaciones.`;

    const text = await this.ask('claude-haiku-4-5-20251001', prompt, 400);
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
      ? `URL de ${detectedPlatform}: ${safeContent}\nGenerá un patrón viral típico de alto rendimiento para esa plataforma en el mercado latinoamericano.`
      : `Contenido:\n${safeContent}${sourceUrl ? `\nURL fuente: ${sourceUrl}` : ''}`;

    const prompt = `Sos experto en publicidad viral de Meta Ads para el mercado latinoamericano.
Analizá el siguiente contenido y extraé los patrones clave. Escribí en español correcto.

${contentBlock}

Respondé SOLO con este JSON válido:
{
  "hook": "gancho principal en español correcto (máx 80 chars)",
  "style": "estilo visual",
  "platform": "reels",
  "tone": "urgencia",
  "visualNotes": "notas de edición recomendadas",
  "cta": "llamada a la acción",
  "audience": "audiencia objetivo",
  "score": 80,
  "type": "video"
}`;

    const raw = await this.ask('claude-haiku-4-5-20251001', prompt, 400);
    try { return JSON.parse(raw.replace(/```json|```/g, '').trim()); }
    catch {
      const firstLine = safeContent.split(/[.!\n]/)[0]?.slice(0, 80) ?? 'Hook extraído';
      return { hook: firstLine, score: 75, platform: detectedPlatform, type: 'video' };
    }
  }

  // ── Generate creative prompt ──────────────────────────────────────────────

  async generateCreativePrompt(product: string, style: string, format: string) {
    const prompt = `Generate a professional OpenAI image generation prompt for a Meta Ads creative.
Product: ${this.sanitize(product, 100)}
Style: ${this.sanitize(style, 100)}
Format: ${this.sanitize(format, 10)}

Requirements: photorealistic, studio lighting, commercial product photography, premium quality.
Reply ONLY with the prompt in English, no explanations.`;

    return this.ask('claude-haiku-4-5-20251001', prompt, 300);
  }

  // ── Build optimized OpenAI image prompt (with optional vision) ────────────

  async buildImagePrompt(input: {
    product: string;
    style: string;
    format: '9:16' | '4:5' | '1:1';
    hook?: string;
    description?: string;
    imageBase64?: string;
    mimeType?: string;
  }): Promise<string> {
    const product     = this.sanitize(input.product, 150);
    const style       = this.sanitize(input.style, 100);
    const description = input.description ? this.sanitize(input.description, 300) : '';
    const hook        = input.hook ? this.sanitize(input.hook, 100) : '';

    const styleMap: Record<string, string> = {
      'Hook urgencia':   'dramatic dark background, cinematic studio lighting, luxury advertisement',
      'Oferta limitada': 'vibrant sale energy, bold colors, high contrast commercial photography',
      'Unboxing':        'warm lifestyle setting, natural light, e-commerce product reveal',
      'Comparativa':     'clean white studio, sharp focus, professional product comparison',
      'Testimonial':     'bright natural lifestyle, authentic real-world product usage',
      'Producto hero':   'dark gradient background, dramatic studio lighting, premium hero shot',
    };
    const styleDesc = styleMap[style] ?? 'professional commercial photography, studio quality';

    let prompt: string;

    if (input.imageBase64) {
      // Vision: Claude analyzes the uploaded photo
      const visionRes = await this.getClient().messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: (input.mimeType ?? 'image/jpeg') as any,
                data: input.imageBase64,
              },
            },
            {
              type: 'text',
              text: `This is a product photo for "${product}"${description ? ` (${description})` : ''}.
Generate an optimized English prompt for OpenAI gpt-image-1 to create a professional Meta Ads creative.
The prompt must:
- Reference the specific product visible in the photo (describe it precisely)
- Request ${styleDesc}
- Request photorealistic studio quality, no watermarks
- Be formatted as a Meta Ads creative for Facebook/Instagram
- Include: ${hook ? `campaign hook concept "${hook}"` : 'compelling visual composition'}
- Target: Latin American e-commerce market
Reply ONLY with the optimized prompt in English.`,
            },
          ],
        }],
      });
      prompt = (visionRes.content[0] as any).text.trim();
    } else {
      // Text-only: generate prompt from product info
      const res = await this.getClient().messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Generate an optimized English prompt for OpenAI gpt-image-1 to create a professional Meta Ads creative.
Product: "${product}"${description ? ` — ${description}` : ''}
Style: ${styleDesc}
${hook ? `Campaign concept: "${hook}"` : ''}

The prompt must request: photorealistic product photography, studio quality, commercial advertisement style, no watermarks, Meta Ads format for Latin American market.
Reply ONLY with the prompt in English.`,
        }],
      });
      prompt = (res.content[0] as any).text.trim();
    }

    return prompt;
  }
}
