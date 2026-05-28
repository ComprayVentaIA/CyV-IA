import axios from 'axios';
import { aiApi } from '../api/ai';

const OPENAI_EDITS_URL = 'https://api.openai.com/v1/images/edits';
const OPENAI_GEN_URL   = 'https://api.openai.com/v1/images/generations';

const FORMAT_SIZE: Record<'9:16' | '4:5' | '1:1', '1024x1536' | '1024x1024'> = {
  '9:16': '1024x1536',
  '4:5':  '1024x1536',
  '1:1':  '1024x1024',
};

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!key) throw new Error('VITE_OPENAI_API_KEY no configurado en Vercel → Settings → Environment Variables');
  return key;
}

async function blobUrlToBase64(blobUrl: string): Promise<{ base64: string; mimeType: string }> {
  const res  = await fetch(blobUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => {
      const dataUrl  = reader.result as string;
      const mimeType = blob.type || 'image/jpeg';
      const base64   = dataUrl.split(',')[1];
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function blobUrlToFile(blobUrl: string): Promise<File> {
  const res  = await fetch(blobUrl);
  const blob = await res.blob();
  const ext  = blob.type.includes('png') ? 'png' : 'jpg';
  return new File([blob], `product.${ext}`, { type: blob.type || 'image/jpeg' });
}

// ── Claude builds the prompt, OpenAI generates the image ──────────────────

async function getClaudePrompt(params: {
  product: string;
  style: string;
  format: '9:16' | '4:5' | '1:1';
  hook?: string;
  description?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<string> {
  try {
    const res = await aiApi.buildImagePrompt(params);
    const prompt = (res.data as any)?.data?.prompt ?? '';
    if (prompt.length > 20) return prompt;
  } catch { /* fallback below */ }

  // Fallback: simple prompt if backend unavailable
  const desc = params.description ? `, ${params.description}` : '';
  const hook = params.hook ? `. Campaign: "${params.hook}"` : '';
  return `Professional Meta Ads creative product photography for "${params.product}"${desc}${hook}. Studio quality, photorealistic, commercial advertisement style, no watermarks. Latin American e-commerce market.`;
}

// ── Edit uploaded photo with AI ────────────────────────────────────────────
// Flow: blob URL → Claude vision analyzes → optimized prompt → OpenAI edits

export async function editProductImage(
  photoUrl: string,
  product: string,
  style: string,
  format: '9:16' | '4:5' | '1:1',
  hook?: string,
  description?: string,
): Promise<string> {
  const apiKey = getApiKey();
  const size   = FORMAT_SIZE[format];

  // Step 1: convert photo to base64 for Claude vision
  const { base64: imageBase64, mimeType } = await blobUrlToBase64(photoUrl);

  // Step 2: Claude analyzes the photo and builds the optimized prompt
  const prompt = await getClaudePrompt({ product, style, format, hook, description, imageBase64, mimeType });

  // Step 3: OpenAI edits the photo using Claude's prompt
  try {
    const file = await blobUrlToFile(photoUrl);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', prompt);
    formData.append('model', 'gpt-image-1');
    formData.append('size', size);
    formData.append('n', '1');

    const res = await axios.post(OPENAI_EDITS_URL, formData, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 90_000,
    });

    const b64 = res.data.data[0].b64_json as string;
    return `data:image/png;base64,${b64}`;

  } catch {
    // Fallback: generate from Claude's prompt (no photo input)
    const res = await axios.post(OPENAI_GEN_URL, {
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size,
      quality: 'medium',
    }, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      timeout: 90_000,
    });

    const b64 = res.data.data[0].b64_json as string;
    return `data:image/png;base64,${b64}`;
  }
}

// ── Generate from text only (no photo) ────────────────────────────────────
// Flow: Claude generates optimized prompt → OpenAI generates image

export async function generateProductImage(
  product: string,
  style: string,
  format: '9:16' | '4:5' | '1:1',
  hook?: string,
  description?: string,
): Promise<string> {
  const apiKey = getApiKey();
  const size   = FORMAT_SIZE[format];

  // Claude generates the optimized prompt
  const prompt = await getClaudePrompt({ product, style, format, hook, description });

  const res = await axios.post(OPENAI_GEN_URL, {
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size,
    quality: 'medium',
  }, {
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    timeout: 90_000,
  });

  const b64 = res.data.data[0].b64_json as string;
  return `data:image/png;base64,${b64}`;
}
