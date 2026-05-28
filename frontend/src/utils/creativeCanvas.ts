export interface CreativeCanvasOpts {
  hook: string;
  product: string;
  format: '9:16' | '4:5' | '1:1';
  style?: string;
  avatarEmoji?: string;
  gradientFrom?: string;
  gradientTo?: string;
  backgroundImageUrl?: string; // uploaded product photo
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  from: string, to: string,
) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, from);
  grad.addColorStop(1, to);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 30) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
}

function drawAdLayers(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  hook: string, product: string, style: string, avatarEmoji: string,
  hasPhoto: boolean,
) {
  // Top branding bar
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, w, 40);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = `bold ${Math.round(w * 0.033)}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('CONVERSIA ADS', 14, 20);
  ctx.fillStyle = '#7c5cfc';
  ctx.font = `${Math.round(w * 0.028)}px monospace`;
  ctx.textAlign = 'right';
  ctx.fillText('IA GENERADO', w - 14, 20);

  if (!hasPhoto) {
    // Emoji only when no photo
    ctx.font = `${Math.round(w * 0.18)}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(avatarEmoji, w / 2, Math.round(h * 0.33));

    // Accent line
    const lineW = w * 0.5;
    const lineX = (w - lineW) / 2;
    const lineY = Math.round(h * 0.44);
    const lineGrad = ctx.createLinearGradient(lineX, 0, lineX + lineW, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.5, '#7c5cfc');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(lineX, lineY);
    ctx.lineTo(lineX + lineW, lineY);
    ctx.stroke();
  }

  // Bottom dark gradient for text readability (always)
  const textZoneH = hasPhoto ? h * 0.48 : h * 0.52;
  const textGrad = ctx.createLinearGradient(0, h - textZoneH, 0, h);
  textGrad.addColorStop(0, 'rgba(0,0,0,0)');
  textGrad.addColorStop(0.35, 'rgba(0,0,0,0.7)');
  textGrad.addColorStop(1, 'rgba(0,0,0,0.92)');
  ctx.fillStyle = textGrad;
  ctx.fillRect(0, h - textZoneH, w, textZoneH);

  // Hook text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.round(w * 0.068)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 6;
  const hookLines = wrapText(ctx, hook.toUpperCase(), w - 40);
  const lh = Math.round(w * 0.085);
  const hookStartY = hasPhoto ? h - 180 : Math.round(h * 0.53);
  hookLines.forEach((line, i) => ctx.fillText(line, w / 2, hookStartY + i * lh));
  ctx.shadowBlur = 0;

  // Product name
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = `${Math.round(w * 0.038)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const prodY = hasPhoto ? h - 80 : Math.round(h * 0.73);
  ctx.fillText(product, w / 2, prodY);

  if (!hasPhoto) {
    // Style tag pill (only in no-photo mode)
    const tagLabel = style.slice(0, 22);
    ctx.font = `${Math.round(w * 0.032)}px monospace`;
    ctx.textBaseline = 'middle';
    const tagW = Math.min(ctx.measureText(tagLabel).width + 28, w - 40);
    const tagH = 26;
    const tagX = (w - tagW) / 2;
    const tagY = Math.round(h * 0.77);
    ctx.fillStyle = 'rgba(124,92,252,0.8)';
    fillRoundRect(ctx, tagX, tagY, tagW, tagH, 13);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(tagLabel, w / 2, tagY + tagH / 2);
  }

  // WhatsApp CTA bar
  const ctaH = 56;
  const ctaGrad = ctx.createLinearGradient(0, 0, w, 0);
  ctaGrad.addColorStop(0, '#25d366');
  ctaGrad.addColorStop(1, '#1a9e4f');
  ctx.fillStyle = ctaGrad;
  ctx.fillRect(0, h - ctaH, w, ctaH);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.round(w * 0.048)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💬  Escribinos por WhatsApp', w / 2, h - ctaH + 28);
}

export async function generateCreativeImage(opts: CreativeCanvasOpts): Promise<string> {
  const {
    hook,
    product,
    format,
    style = 'Hook urgencia',
    avatarEmoji = '🎬',
    gradientFrom = '#1a0528',
    gradientTo = '#3d0f6b',
    backgroundImageUrl,
  } = opts;

  const [w, h] = format === '9:16' ? [360, 640] : format === '4:5' ? [400, 500] : [400, 400];

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  if (backgroundImageUrl) {
    try {
      const img = await loadImage(backgroundImageUrl);
      // Draw as cover (fill canvas, centered)
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } catch {
      // Image load failed — fallback to gradient
      drawBackground(ctx, w, h, gradientFrom, gradientTo);
    }
  } else {
    drawBackground(ctx, w, h, gradientFrom, gradientTo);
  }

  drawAdLayers(ctx, w, h, hook, product, style, avatarEmoji, !!backgroundImageUrl);

  return canvas.toDataURL('image/jpeg', 0.92);
}
