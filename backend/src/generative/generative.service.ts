import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfInference } from '@huggingface/inference';
import * as ffmpeg from 'fluent-ffmpeg';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

type Format = '9:16' | '4:5' | '1:1';
type Movement = 'zoom_in' | 'zoom_out' | 'pan_right' | 'pan_left';

const FORMAT_SIZE: Record<Format, [number, number]> = {
  '9:16': [576, 1024],
  '4:5': [640, 800],
  '1:1': [1024, 1024],
};

const STYLE_PROMPTS: Record<string, string> = {
  'Hook urgencia':   'luxury product advertisement, dramatic cinematic lighting, dark moody background, ultra realistic, 8k',
  'Oferta limitada': 'vibrant sale advertisement, bold colors, product hero shot, commercial photography, high energy',
  'Unboxing':        'product unboxing photography, lifestyle setting, warm natural lighting, e-commerce style',
  'Comparativa':     'clean product comparison, studio photography, white background, professional product shot',
  'Testimonial':     'lifestyle product photography, happy person using product, bright natural environment, authentic',
  'Producto hero':   'luxury hero product shot, dramatic studio lighting, dark background, ultra detailed, cinematic',
};

@Injectable()
export class GenerativeService {
  private readonly hf: HfInference | null;
  private readonly enabled: boolean;
  private readonly logger = new Logger(GenerativeService.name);

  constructor(private readonly config: ConfigService) {
    const apiKey = config.get<string>('huggingface.apiKey');
    this.enabled = !!apiKey;
    this.hf = this.enabled ? new HfInference(apiKey) : null;
    if (!this.enabled) {
      this.logger.warn('HUGGINGFACE_API_KEY not set — AI image generation disabled');
    }
  }

  // ── Build optimized prompt ─────────────────────────────────────────────────

  buildPrompt(product: string, style: string, hook?: string): string {
    const styleDesc = STYLE_PROMPTS[style] ?? 'professional product advertisement, high quality';
    const hookPart = hook ? `, "${hook}" text concept` : '';
    return `${product}${hookPart}, ${styleDesc}, Meta Ads creative, social media advertisement, photorealistic, no text overlay, no watermark, clean composition`;
  }

  // ── Generate image via HuggingFace FLUX.1-schnell ─────────────────────────

  async generateImage(product: string, style: string, format: Format = '9:16', hook?: string): Promise<string> {
    if (!this.enabled || !this.hf) {
      throw new Error('HUGGINGFACE_API_KEY no configurado. Agregalo en Railway → Variables.');
    }

    const prompt = this.buildPrompt(product, style, hook);
    const [width, height] = FORMAT_SIZE[format];

    this.logger.log(`Generating image: "${prompt.slice(0, 60)}..." ${width}x${height}`);

    const blob = await this.hf.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: prompt,
      parameters: { width, height, num_inference_steps: 4 } as any,
    });

    const arrayBuffer = await blob.arrayBuffer();
    const b64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:image/jpeg;base64,${b64}`;
  }

  // ── Generate cinematic video from image using ffmpeg ───────────────────────

  async generateVideo(imageBase64: string, format: Format = '9:16', movement: Movement = 'zoom_in'): Promise<string> {
    const [width, height] = FORMAT_SIZE[format];
    const tmpDir = os.tmpdir();
    const ts = Date.now();
    const imgPath = path.join(tmpDir, `conversia_img_${ts}.jpg`);
    const vidPath = path.join(tmpDir, `conversia_vid_${ts}.mp4`);

    // Write image to temp file
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(imgPath, Buffer.from(base64Data, 'base64'));

    // Build cinematic filter based on movement
    const frames = 150; // 6s at 25fps
    const s = `${width}x${height}`;

    const filterMap: Record<Movement, string> = {
      zoom_in:   `zoompan=z='min(zoom+0.0015,1.5)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${s}:fps=25,format=yuv420p`,
      zoom_out:  `zoompan=z='if(lte(on,1),1.4,max(1,zoom-0.002))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${s}:fps=25,format=yuv420p`,
      pan_right: `zoompan=z='1.2':x='min(on*3,iw*(1-1/zoom))':y='(ih-oh)/2':d=${frames}:s=${s}:fps=25,format=yuv420p`,
      pan_left:  `zoompan=z='1.2':x='max(iw*(1-1/zoom)-on*3,0)':y='(ih-oh)/2':d=${frames}:s=${s}:fps=25,format=yuv420p`,
    };

    const vf = filterMap[movement];

    await new Promise<void>((resolve, reject) => {
      ffmpeg(imgPath)
        .inputOptions(['-loop 1', '-framerate 25'])
        .videoFilter(vf)
        .outputOptions(['-t 6', '-c:v libx264', '-crf 23', '-preset fast', '-movflags +faststart'])
        .output(vidPath)
        .on('start', cmd => this.logger.log(`ffmpeg: ${cmd.slice(0, 80)}...`))
        .on('end', () => resolve())
        .on('error', err => reject(err))
        .run();
    });

    const videoBuffer = fs.readFileSync(vidPath);
    const b64 = videoBuffer.toString('base64');

    // Cleanup temp files
    [imgPath, vidPath].forEach(f => { try { fs.unlinkSync(f); } catch { /* ignore */ } });

    return `data:video/mp4;base64,${b64}`;
  }
}
