import axios from 'axios';

const DALLE_URL = 'https://api.openai.com/v1/images/generations';

// DALL-E 3 only supports these sizes
const FORMAT_SIZE: Record<'9:16' | '4:5' | '1:1', '1024x1792' | '1024x1024'> = {
  '9:16': '1024x1792',
  '4:5':  '1024x1024',
  '1:1':  '1024x1024',
};

const STYLE_DESC: Record<string, string> = {
  'Hook urgencia':   'dramatic dark moody background, cinematic studio lighting, ultra realistic',
  'Oferta limitada': 'vibrant bold colors, high energy commercial photography, product hero shot',
  'Unboxing':        'lifestyle unboxing setting, warm natural lighting, e-commerce style',
  'Comparativa':     'clean white studio background, professional product comparison shot',
  'Testimonial':     'lifestyle photography, bright natural environment, authentic feeling',
  'Producto hero':   'luxury hero shot, dramatic studio lighting, dark background, ultra detailed',
  'Texto grande, fondo oscuro, urgencia': 'dramatic dark background, bold product display, cinematic',
  'Texto grande, fondo en': 'vibrant colorful background, bold product display, commercial',
};

export async function generateDalleImage(
  product: string,
  style: string,
  format: '9:16' | '4:5' | '1:1',
  hook?: string,
  description?: string,
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY no configurado en Vercel');

  const styleDesc = STYLE_DESC[style] ?? 'professional product advertisement, high quality';
  const descPart = description ? `. ${description}` : '';
  const hookPart = hook ? `. Ad concept: "${hook}"` : '';

  const prompt = `Professional Meta Ads creative product photography: ${product}${descPart}${hookPart}. ${styleDesc}. Commercial advertisement for social media, photorealistic, studio quality, no text overlay, no watermarks, clean composition. Latin American market.`;

  const res = await axios.post(DALLE_URL, {
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: FORMAT_SIZE[format],
    quality: 'standard',
    response_format: 'b64_json',
  }, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 60_000,
  });

  const b64 = res.data.data[0].b64_json as string;
  return `data:image/png;base64,${b64}`;
}
