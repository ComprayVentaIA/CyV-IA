import axios from 'axios';

const OPENAI_URL = 'https://api.openai.com/v1/images/generations';

// gpt-image-1 supported sizes
const FORMAT_SIZE: Record<'9:16' | '4:5' | '1:1', '1024x1536' | '1024x1024'> = {
  '9:16': '1024x1536',
  '4:5':  '1024x1536',
  '1:1':  '1024x1024',
};

const STYLE_DESC: Record<string, string> = {
  'Hook urgencia':   'dramatic dark moody background, cinematic studio lighting, ultra realistic product photo',
  'Oferta limitada': 'vibrant bold colors, high energy commercial photography, product hero shot with sale energy',
  'Unboxing':        'lifestyle unboxing setup, warm natural lighting, e-commerce product photography',
  'Comparativa':     'clean white studio background, professional product comparison, sharp focus',
  'Testimonial':     'lifestyle photography, bright natural light, authentic real-life product usage',
  'Producto hero':   'luxury hero shot, dramatic studio lighting, dark gradient background, ultra detailed',
  'Texto grande, fondo oscuro, urgencia': 'dark dramatic background, bold product placement, cinematic lighting',
  'Texto grande, fondo en': 'vibrant colorful gradient background, bold product display, high energy commercial',
};

export async function generateDalleImage(
  product: string,
  style: string,
  format: '9:16' | '4:5' | '1:1',
  hook?: string,
  description?: string,
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY no está configurado en Vercel → Settings → Environment Variables');

  const styleDesc = STYLE_DESC[style] ?? 'professional product advertisement, commercial photography, high quality';
  const descPart = description ? `, ${description}` : '';
  const hookPart = hook ? `. Campaign concept: "${hook}"` : '';

  // Structured prompt optimized for gpt-image-1 and Meta Ads
  const prompt = [
    `High-quality Meta Ads product image for "${product}"${descPart}.`,
    hookPart,
    styleDesc,
    'Commercial advertisement style, photorealistic, studio quality lighting.',
    'E-commerce product photography for Latin American market.',
    'Clean professional composition, no watermarks.',
  ].filter(Boolean).join(' ');

  const res = await axios.post(OPENAI_URL, {
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: FORMAT_SIZE[format],
    quality: 'medium',
  }, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 90_000,
  });

  const b64 = res.data.data[0].b64_json as string;
  return `data:image/png;base64,${b64}`;
}
