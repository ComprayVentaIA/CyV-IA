export interface CreativeCanvasOpts {
  hook: string;
  product: string;
  format: '9:16' | '4:5' | '1:1';
  style?: string;
  avatarEmoji?: string;
  gradientFrom?: string;
  gradientTo?: string;
  backgroundImageUrl?: string;
  bullets?: string[];
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 3): string[] {
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
  return lines.slice(0, maxLines);
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

// ── Product-photo template (structured layout like professional ad tool) ──────

async function drawProductAdTemplate(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  img: HTMLImageElement,
  hook: string, product: string,
  bullets: string[],
  brandColor: string,
) {
  // ── Background: solid brand dark ──────────────────────────────────────────
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, w, h);

  if (h > w) {
    // Vertical (9:16 or 4:5) — product top 55%, info bottom 45%
    const imgH = Math.round(h * 0.54);
    const imgW = w;

    // Product photo area
    const scale = Math.max(imgW / img.width, imgH / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (imgW - dw) / 2;
    const dy = (imgH - dh) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, imgW, imgH);
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    // Gradient fade from photo into dark section
    const fadeGrad = ctx.createLinearGradient(0, imgH - 80, 0, imgH + 30);
    fadeGrad.addColorStop(0, 'rgba(13,17,23,0)');
    fadeGrad.addColorStop(1, 'rgba(13,17,23,1)');
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(0, imgH - 80, w, 110);

    // Top branding bar overlay on photo
    const barGrad = ctx.createLinearGradient(0, 0, 0, 44);
    barGrad.addColorStop(0, 'rgba(0,0,0,0.75)');
    barGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = barGrad;
    ctx.fillRect(0, 0, w, 44);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(w * 0.032)}px monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CONVERSIA ADS', 14, 22);
    ctx.fillStyle = brandColor;
    ctx.font = `${Math.round(w * 0.028)}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText('IA GENERADO', w - 14, 22);

    // ── Info section ─────────────────────────────────────────────────────────
    const infoY = imgH + 10;
    const pad = 18;

    // Hook text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(w * 0.072)}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    const hookLines = wrapText(ctx, hook, w - pad * 2, 2);
    const lh = Math.round(w * 0.085);
    hookLines.forEach((line, i) => ctx.fillText(line, pad, infoY + i * lh));
    ctx.shadowBlur = 0;

    // Product name under hook
    const nameY = infoY + hookLines.length * lh + 6;
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = `${Math.round(w * 0.038)}px sans-serif`;
    ctx.fillText(product, pad, nameY);

    // Bullets
    const bY = nameY + Math.round(w * 0.052) + 8;
    const bItems = bullets.length > 0 ? bullets : ['Calidad garantizada', 'Envío rápido', 'Precio especial'];
    ctx.font = `${Math.round(w * 0.036)}px sans-serif`;
    bItems.slice(0, 3).forEach((b, i) => {
      const y = bY + i * Math.round(w * 0.052);
      ctx.fillStyle = brandColor;
      ctx.fillText('✓', pad, y);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(b, pad + Math.round(w * 0.048), y);
    });

  } else {
    // Square (1:1) — product right 55%, info left 45%
    const splitX = Math.round(w * 0.44);

    // Left panel: brand bg
    const leftGrad = ctx.createLinearGradient(0, 0, splitX + 40, 0);
    leftGrad.addColorStop(0, '#0d1117');
    leftGrad.addColorStop(1, '#141a24');
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, splitX + 40, h);

    // Right panel: product photo
    const phW = w - splitX;
    const scale = Math.max(phW / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = splitX + (phW - dw) / 2;
    const dy = (h - dh) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(splitX, 0, phW, h);
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    // Fade left edge of photo into dark panel
    const fadeGrad = ctx.createLinearGradient(splitX - 10, 0, splitX + 60, 0);
    fadeGrad.addColorStop(0, 'rgba(13,17,23,1)');
    fadeGrad.addColorStop(1, 'rgba(13,17,23,0)');
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(splitX - 10, 0, 70, h);

    // Left: branding
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(w * 0.028)}px monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('CONVERSIA', 14, 14);
    ctx.fillStyle = brandColor;
    ctx.fillText('ADS IA', 14, 14 + Math.round(w * 0.036));

    // Accent bar
    ctx.fillStyle = brandColor;
    ctx.fillRect(14, Math.round(h * 0.22), 3, Math.round(h * 0.08));

    // Hook
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(w * 0.065)}px sans-serif`;
    ctx.textBaseline = 'top';
    const hookLines = wrapText(ctx, hook, splitX - 24, 3);
    const lh = Math.round(w * 0.075);
    hookLines.forEach((line, i) => ctx.fillText(line, 14, Math.round(h * 0.32) + i * lh));

    // Product name
    const pY = Math.round(h * 0.32) + hookLines.length * lh + 6;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `${Math.round(w * 0.034)}px sans-serif`;
    ctx.fillText(product, 14, pY);

    // Bullets
    const bItems = bullets.length > 0 ? bullets : ['Calidad premium', 'Precio especial'];
    ctx.font = `${Math.round(w * 0.03)}px sans-serif`;
    bItems.slice(0, 2).forEach((b, i) => {
      const y = pY + Math.round(w * 0.045) + i * Math.round(w * 0.042);
      ctx.fillStyle = brandColor;
      ctx.fillText('✓', 14, y);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fillText(b.slice(0, 18), 14 + Math.round(w * 0.04), y);
    });
  }

  // ── WhatsApp CTA bar (all formats) ───────────────────────────────────────
  const ctaH = Math.round(h * 0.085);
  const ctaGrad = ctx.createLinearGradient(0, 0, w, 0);
  ctaGrad.addColorStop(0, '#25d366');
  ctaGrad.addColorStop(1, '#1a9e4f');
  ctx.fillStyle = ctaGrad;
  ctx.fillRect(0, h - ctaH, w, ctaH);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.round(w * 0.048)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💬  Escribinos por WhatsApp', w / 2, h - ctaH / 2);
}

// ── Gradient-only template (no photo) ─────────────────────────────────────────

function drawGradientTemplate(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  hook: string, product: string, style: string, avatarEmoji: string,
  gradientFrom: string, gradientTo: string,
) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, gradientFrom);
  grad.addColorStop(1, gradientTo);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, w, 40);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = `bold ${Math.round(w * 0.033)}px monospace`;
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('CONVERSIA ADS', 14, 20);
  ctx.fillStyle = '#7c5cfc';
  ctx.font = `${Math.round(w * 0.028)}px monospace`;
  ctx.textAlign = 'right';
  ctx.fillText('IA GENERADO', w - 14, 20);

  ctx.font = `${Math.round(w * 0.18)}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText(avatarEmoji, w / 2, Math.round(h * 0.33));

  const lineW = w * 0.5, lineX = (w - lineW) / 2, lineY = Math.round(h * 0.44);
  const lineGrad = ctx.createLinearGradient(lineX, 0, lineX + lineW, 0);
  lineGrad.addColorStop(0, 'transparent'); lineGrad.addColorStop(0.5, '#7c5cfc'); lineGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = lineGrad; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(lineX, lineY); ctx.lineTo(lineX + lineW, lineY); ctx.stroke();

  const textGrad = ctx.createLinearGradient(0, h * 0.45, 0, h - 60);
  textGrad.addColorStop(0, 'rgba(0,0,0,0)'); textGrad.addColorStop(1, 'rgba(0,0,0,0.7)');
  ctx.fillStyle = textGrad; ctx.fillRect(0, h * 0.45, w, h - 60 - h * 0.45);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.round(w * 0.065)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 6;
  const hookLines = wrapText(ctx, hook.toUpperCase(), w - 48);
  const lh = Math.round(w * 0.082);
  hookLines.forEach((line, i) => ctx.fillText(line, w / 2, Math.round(h * 0.53) + i * lh));
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `${Math.round(w * 0.04)}px sans-serif`;
  ctx.fillText(product, w / 2, Math.round(h * 0.73));

  const tagLabel = style.slice(0, 22);
  ctx.font = `${Math.round(w * 0.032)}px monospace`;
  ctx.textBaseline = 'middle';
  const tagW = Math.min(ctx.measureText(tagLabel).width + 28, w - 40);
  const tagH = 26, tagX = (w - tagW) / 2, tagY = Math.round(h * 0.77);
  ctx.fillStyle = 'rgba(124,92,252,0.8)';
  fillRoundRect(ctx, tagX, tagY, tagW, tagH, 13);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(tagLabel, w / 2, tagY + tagH / 2);

  const ctaH = 60;
  const ctaGrad = ctx.createLinearGradient(0, 0, w, 0);
  ctaGrad.addColorStop(0, '#25d366'); ctaGrad.addColorStop(1, '#1a9e4f');
  ctx.fillStyle = ctaGrad; ctx.fillRect(0, h - ctaH, w, ctaH);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.round(w * 0.05)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('💬  Escribinos por WhatsApp', w / 2, h - ctaH + 30);
}

// ── Main export ───────────────────────────────────────────────────────────────

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
    bullets = [],
  } = opts;

  const [w, h] = format === '9:16' ? [360, 640] : format === '4:5' ? [400, 500] : [400, 400];

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  if (backgroundImageUrl) {
    try {
      const img = await loadImage(backgroundImageUrl);
      await drawProductAdTemplate(ctx, w, h, img, hook, product, bullets, '#7c5cfc');
    } catch {
      drawGradientTemplate(ctx, w, h, hook, product, style, avatarEmoji, gradientFrom, gradientTo);
    }
  } else {
    drawGradientTemplate(ctx, w, h, hook, product, style, avatarEmoji, gradientFrom, gradientTo);
  }

  return canvas.toDataURL('image/jpeg', 0.93);
}
