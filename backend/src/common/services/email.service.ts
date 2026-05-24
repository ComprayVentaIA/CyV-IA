import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly from: string;
  private readonly logger = new Logger(EmailService.name);
  private readonly appName = 'AI Commerce Ads Suite';
  private readonly appUrl: string;

  private readonly enabled: boolean;

  constructor(private readonly config: ConfigService) {
    const apiKey = config.get<string>('email.resendApiKey');
    this.enabled = !!apiKey;
    // Only instantiate Resend when a key is available — avoids crash on startup
    this.resend = this.enabled ? new Resend(apiKey) : (null as unknown as Resend);
    this.from = config.get<string>('email.from', 'noreply@aicommerceads.com');
    this.appUrl = config.get<string>('frontendUrl', 'http://localhost:3001');
    if (!this.enabled) {
      this.logger.warn('⚠️  RESEND_API_KEY not set — email sending disabled (degraded mode)');
    }
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.enabled) {
      this.logger.warn(`Email skipped (no API key): ${subject} → ${to}`);
      return;
    }
    try {
      await this.resend.emails.send({ from: this.from, to, subject, html });
      this.logger.log(`📧 Email sent to ${to}: ${subject}`);
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
    }
  }

  private wrap(content: string, title: string): string {
    return `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<style>
  body{font-family:'DM Sans',Arial,sans-serif;background:#07070f;color:#e2e2f0;margin:0;padding:0}
  .container{max-width:560px;margin:40px auto;padding:0 20px}
  .card{background:#0f0f1a;border:1px solid #1a1a2e;border-radius:16px;overflow:hidden}
  .header{background:linear-gradient(135deg,#7c5cfc,#4da6ff);padding:28px 32px}
  .header h1{color:#fff;font-size:20px;margin:0;font-family:Syne,sans-serif;font-weight:800}
  .header p{color:#ffffffaa;font-size:13px;margin:6px 0 0}
  .body{padding:28px 32px}
  .body p{font-size:14px;line-height:1.7;color:#aaa8c0;margin:0 0 16px}
  .body h2{font-size:16px;color:#e2e2f0;margin:0 0 12px;font-family:Syne,sans-serif}
  .btn{display:inline-block;background:linear-gradient(135deg,#7c5cfc,#4da6ff);color:#fff;padding:12px 28px;border-radius:9px;text-decoration:none;font-weight:600;font-size:14px;margin:8px 0}
  .code{background:#1a1a2e;border:1px solid #252540;border-radius:8px;padding:14px 18px;font-family:'DM Mono',monospace;font-size:18px;color:#7c5cfc;text-align:center;letter-spacing:4px;margin:16px 0}
  .info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1a1a2e22;font-size:13px}
  .info-row:last-child{border-bottom:none}
  .info-lbl{color:#5a5a80}
  .footer{padding:20px 32px;border-top:1px solid #1a1a2e;text-align:center;font-size:11px;color:#2a2a45}
  .badge{display:inline-block;background:#7c5cfc18;border:1px solid #7c5cfc33;border-radius:20px;padding:4px 14px;font-size:11px;color:#7c5cfc;margin-bottom:20px}
  .green{color:#00d68f} .red{color:#ff4d6a} .amber{color:#ffb347}
</style></head>
<body><div class="container"><div class="card">
  <div class="header"><h1>${this.appName}</h1><p>${title}</p></div>
  <div class="body">${content}</div>
  <div class="footer">© 2026 ${this.appName} · Creado por Alan Ugarte · <a href="${this.appUrl}" style="color:#7c5cfc">aicommerceads.com</a></div>
</div></div></body></html>`;
  }

  // ── Verification email ─────────────────────────────────────────────────────

  async sendVerification(email: string, name: string, token: string) {
    const url = `${this.appUrl}/verify-email?token=${token}`;
    await this.send(email, `Verificá tu email — ${this.appName}`, this.wrap(`
      <div class="badge">✉️ Verificación de email</div>
      <h2>Hola, ${name} 👋</h2>
      <p>¡Gracias por registrarte en <strong style="color:#7c5cfc">${this.appName}</strong>! Para activar tu cuenta, hacé click en el botón de abajo.</p>
      <a href="${url}" class="btn">Verificar mi email →</a>
      <p style="font-size:12px;color:#5a5a80">El enlace expira en 24 horas. Si no creaste esta cuenta, ignorá este email.</p>
    `, 'Verificá tu cuenta'));
  }

  // ── Welcome email (after payment) ─────────────────────────────────────────

  async sendWelcome(email: string, name: string, plan: string) {
    const planPrices: Record<string,string> = { starter:'$49/mes', growth:'$99/mes', scale:'$199/mes' };
    await this.send(email, `¡Bienvenido a ${this.appName}! 🎉`, this.wrap(`
      <div class="badge">🎉 ¡Suscripción activada!</div>
      <h2>¡Bienvenido, ${name}!</h2>
      <p>Tu cuenta está activa y lista para usar. Tenés <strong style="color:#00d68f">7 días gratis</strong> para explorar todo.</p>
      <div style="background:#7c5cfc18;border:1px solid #7c5cfc33;border-radius:10px;padding:16px;margin:16px 0">
        <div style="font-size:13px;color:#5a5a80;margin-bottom:4px">PLAN ACTIVO</div>
        <div style="font-size:20px;font-family:Syne,sans-serif;font-weight:800;color:#7c5cfc">${plan.charAt(0).toUpperCase()+plan.slice(1)} — ${planPrices[plan]||'$99/mes'}</div>
      </div>
      <p>Desde el dashboard podés:</p>
      <p>📣 Crear tu primera campaña en Meta Ads<br>🎨 Generar creativos virales con IA<br>💬 Conectar tu WhatsApp Business<br>📊 Ver métricas en tiempo real</p>
      <a href="${this.appUrl}/dashboard" class="btn">Ir al dashboard →</a>
    `, 'Tu cuenta está lista'));
  }

  // ── Welcome admin-created account ─────────────────────────────────────────

  async sendWelcomeAdmin(email: string, name: string, tempPassword?: string) {
    await this.send(email, `Tu cuenta en ${this.appName} fue creada`, this.wrap(`
      <div class="badge">🔑 Cuenta creada por administrador</div>
      <h2>Hola, ${name}</h2>
      <p>El administrador creó una cuenta para vos en <strong style="color:#7c5cfc">${this.appName}</strong>.</p>
      ${tempPassword ? `
        <div class="code">${tempPassword}</div>
        <p style="text-align:center;font-size:12px;color:#5a5a80">Contraseña temporal — cambiala después del primer acceso</p>
      ` : ''}
      <div class="info-row"><span class="info-lbl">Email</span><span>${email}</span></div>
      <a href="${this.appUrl}/login" class="btn">Ingresar a la plataforma →</a>
    `, 'Tu cuenta está lista'));
  }

  // ── Password reset ─────────────────────────────────────────────────────────

  async sendPasswordReset(email: string, name: string, token: string) {
    const url = `${this.appUrl}/reset-password?token=${token}`;
    await this.send(email, `Resetear contraseña — ${this.appName}`, this.wrap(`
      <h2>Hola, ${name}</h2>
      <p>Recibimos una solicitud para resetear tu contraseña. Hacé click abajo para crear una nueva.</p>
      <a href="${url}" class="btn">Resetear contraseña →</a>
      <p style="font-size:12px;color:#5a5a80">Este enlace expira en 2 horas. Si no hiciste esta solicitud, ignorá este email.</p>
    `, 'Reseteo de contraseña'));
  }

  async sendPasswordResetAdmin(email: string, name: string, tempPass: string) {
    await this.send(email, `Tu contraseña fue reseteada — ${this.appName}`, this.wrap(`
      <h2>Hola, ${name}</h2>
      <p>El administrador reseteó tu contraseña. Tu nueva contraseña temporal es:</p>
      <div class="code">${tempPass}</div>
      <p style="font-size:12px;color:#5a5a80;text-align:center">Cambiá esta contraseña después de ingresar desde Perfil → Seguridad.</p>
      <a href="${this.appUrl}/login" class="btn">Ingresar →</a>
    `, 'Contraseña reseteada'));
  }

  // ── Daily report ──────────────────────────────────────────────────────────

  async sendDailyReport(email: string, name: string, summary: any, insights: any[], reportId: string) {
    const insightsHtml = insights.slice(0, 5).map((ins: any) => `
      <div style="padding:10px 0;border-bottom:1px solid #1a1a2e22;display:flex;gap:12px;align-items:flex-start">
        <span style="font-size:16px">${ins.type==='scale'?'🚀':ins.type==='pause'?'⏸️':ins.type==='warning'?'⚠️':'📊'}</span>
        <div><div style="font-size:13px;font-weight:500;color:#e2e2f0;margin-bottom:2px">${ins.title||''}</div>
        <div style="font-size:12px;color:#5a5a80">${ins.detail||''}</div></div>
      </div>`).join('');

    await this.send(email, `📊 Informe diario ${new Date().toLocaleDateString('es-AR')} — ${this.appName}`, this.wrap(`
      <div class="badge">📊 Informe automático diario</div>
      <h2>Hola, ${name} 👋</h2>
      <p>Aquí está el resumen de tu rendimiento del día. Generado automáticamente por IA.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0">
        <div style="background:#00d68f18;border:1px solid #00d68f33;border-radius:10px;padding:14px">
          <div style="font-size:10px;color:#5a5a80;text-transform:uppercase;letter-spacing:.1em">ROAS</div>
          <div style="font-size:22px;font-family:Syne,sans-serif;font-weight:800;color:#00d68f">${summary.avgRoas?.toFixed(1)||'—'}x</div>
        </div>
        <div style="background:#7c5cfc18;border:1px solid #7c5cfc33;border-radius:10px;padding:14px">
          <div style="font-size:10px;color:#5a5a80;text-transform:uppercase;letter-spacing:.1em">LEADS WA</div>
          <div style="font-size:22px;font-family:Syne,sans-serif;font-weight:800;color:#7c5cfc">${summary.totalLeads||0}</div>
        </div>
      </div>
      <h2>Insights de IA</h2>
      ${insightsHtml}
      <a href="${this.appUrl}/reports" class="btn" style="margin-top:16px">Ver reporte completo →</a>
    `, `Informe del ${new Date().toLocaleDateString('es-AR')}`));
  }

  // ── Announcement ─────────────────────────────────────────────────────────

  async sendAnnouncement(email: string, name: string, subject: string, body: string) {
    await this.send(email, subject, this.wrap(`
      <div class="badge">📢 Comunicado oficial</div>
      <h2>Hola, ${name}</h2>
      <div style="font-size:14px;line-height:1.8;color:#aaa8c0;white-space:pre-line">${body}</div>
      <a href="${this.appUrl}" class="btn" style="margin-top:20px">Ir a la plataforma →</a>
    `, subject));
  }
}
