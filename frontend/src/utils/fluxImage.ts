import axios from 'axios';

const HF_URL = 'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell';

export const FORMAT_PX: Record<'9:16' | '4:5' | '1:1', [number, number]> = {
  '9:16': [576, 1024],
  '4:5': [640, 800],
  '1:1': [1024, 1024],
};

export const STYLE_DESC: Record<string, string> = {
  'Hook urgencia':   'luxury product advertisement, dramatic cinematic lighting, dark moody background, ultra realistic, 8k',
  'Oferta limitada': 'vibrant sale advertisement, bold colors, product hero shot, commercial photography, high energy',
  'Unboxing':        'product unboxing photography, lifestyle setting, warm natural lighting, e-commerce style',
  'Comparativa':     'clean product comparison, studio photography, white background, professional product shot',
  'Testimonial':     'lifestyle product photography, happy person using product, bright natural environment, authentic',
  'Producto hero':   'luxury hero product shot, dramatic studio lighting, dark background, ultra detailed, cinematic',
  'Texto grande, fondo oscuro, urgencia': 'dramatic dark background advertisement, bold product display, cinematic lighting, ultra realistic',
  'Texto grande, fondo en': 'vibrant colorful advertisement, bold product display, high energy, commercial photography',
};

export async function generateFluxImage(
  product: string,
  style: string,
  format: '9:16' | '4:5' | '1:1',
  hook?: string,
  description?: string,
): Promise<string> {
  const hfKey = import.meta.env.VITE_HF_API_KEY as string | undefined;
  if (!hfKey) throw new Error('VITE_HF_API_KEY no está configurado en Vercel');

  const styleDesc = STYLE_DESC[style] ?? 'professional product advertisement, high quality';
  const descPart = description ? `, ${description}` : '';
  const prompt = `commercial product photography of "${product}"${descPart}, ${styleDesc}, studio lighting, sharp focus, e-commerce advertisement, photorealistic, no text, no watermark, clean background`;

  const [width, height] = FORMAT_PX[format];

  try {
    const res = await axios.post(HF_URL, {
      inputs: prompt,
      parameters: { width, height, num_inference_steps: 4 },
    }, {
      headers: {
        Authorization: `Bearer ${hfKey}`,
        'Content-Type': 'application/json',
        'Accept': 'image/png',
        'x-wait-for-model': 'true',
      },
      responseType: 'blob',
      timeout: 120_000,
    });

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(res.data as Blob);
    });
  } catch (err: any) {
    if (err?.response?.data instanceof Blob) {
      const text = await err.response.data.text();
      throw new Error(`HF ${err.response.status}: ${text.slice(0, 200)}`);
    }
    throw err;
  }
}
