import axios from 'axios';

const OPENAI_EDITS_URL = 'https://api.openai.com/v1/images/edits';
const OPENAI_GEN_URL   = 'https://api.openai.com/v1/images/generations';

const FORMAT_SIZE: Record<'9:16' | '4:5' | '1:1', '1024x1536' | '1024x1024'> = {
  '9:16': '1024x1536',
  '4:5':  '1024x1536',
  '1:1':  '1024x1024',
};

const STYLE_BRIEF: Record<string, string> = {
  'Hook urgencia':   'dramatic dark background, cinematic studio lighting, luxury advertisement',
  'Oferta limitada': 'vibrant sale energy, bold colors, high contrast commercial photography',
  'Unboxing':        'warm lifestyle setting, natural light, e-commerce product reveal',
  'Comparativa':     'clean white studio, sharp focus, professional product comparison',
  'Testimonial':     'bright natural lifestyle, authentic real-world product usage',
  'Producto hero':   'dark gradient background, dramatic studio lighting, premium hero shot',
  'Texto grande, fondo oscuro, urgencia': 'dark dramatic background, bold product placement, cinematic',
  'Texto grande, fondo en': 'vibrant gradient background, energetic commercial style',
};

async function blobUrlToFile(blobUrl: string): Promise<File> {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  const ext = blob.type.includes('png') ? 'png' : 'jpg';
  return new File([blob], `product.${ext}`, { type: blob.type || 'image/jpeg' });
}

// ── Edit uploaded photo with AI ────────────────────────────────────────────

export async function editProductImage(
  photoUrl: string,
  product: string,
  style: string,
  format: '9:16' | '4:5' | '1:1',
  hook?: string,
  description?: string,
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY no configurado en Vercel');

  const styleDesc = STYLE_BRIEF[style] ?? 'professional product advertisement, commercial photography';
  const descPart  = description ? ` (${description})` : '';
  const hookPart  = hook ? ` Campaign hook: "${hook}".` : '';

  const prompt = `Transform this product photo into a professional Meta Ads creative for "${product}"${descPart}.${hookPart} Style: ${styleDesc}. Keep the actual product visible and prominent. Professional studio lighting, commercial advertisement composition for Facebook and Instagram ads. Latin American e-commerce market. High quality, photorealistic.`;

  const size = FORMAT_SIZE[format];

  try {
    // First try: edit the uploaded photo
    const file = await blobUrlToFile(photoUrl);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', prompt);
    formData.append('model', 'gpt-image-1');
    formData.append('size', size);
    formData.append('n', '1');

    const res = await axios.post(OPENAI_EDITS_URL, formData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 90_000,
    });

    const b64 = res.data.data[0].b64_json as string;
    return `data:image/png;base64,${b64}`;

  } catch {
    // Fallback: generate from description if edit fails
    const genPrompt = `High-quality Meta Ads product image: "${product}"${descPart}. ${styleDesc}. Commercial advertisement, photorealistic, studio quality, no watermarks. Latin American market.`;

    const res = await axios.post(OPENAI_GEN_URL, {
      model: 'gpt-image-1',
      prompt: genPrompt,
      n: 1,
      size,
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
}

// ── Generate from text only (no photo) ────────────────────────────────────

export async function generateProductImage(
  product: string,
  style: string,
  format: '9:16' | '4:5' | '1:1',
  hook?: string,
  description?: string,
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY no configurado en Vercel');

  const styleDesc = STYLE_BRIEF[style] ?? 'professional product advertisement';
  const descPart  = description ? `, ${description}` : '';
  const hookPart  = hook ? `. Concept: "${hook}"` : '';

  const prompt = `Professional Meta Ads creative for "${product}"${descPart}${hookPart}. ${styleDesc}. Commercial product photography, studio quality, photorealistic, no watermarks. Latin American e-commerce.`;

  const res = await axios.post(OPENAI_GEN_URL, {
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
