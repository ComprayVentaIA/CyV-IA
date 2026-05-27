import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-script')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generar script de video con IA' })
  async generateScript(@Body() body: { product: string; style?: string; format?: string }) {
    try {
      return await this.aiService.generateScript(
        body.product ?? '',
        body.style ?? 'Hook urgencia',
        body.format ?? '9:16',
      );
    } catch {
      return { text: '¿Todavía pagás de más?\nConseguí el tuyo ahora con envío gratis.\nSolo por hoy. ¡Escribinos por WhatsApp!' };
    }
  }

  @Post('analyze-campaign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analizar producto y generar estrategia de campaña' })
  analyzeCampaign(@Body() body: {
    productName: string;
    description: string;
    price?: number;
    targetAudience?: string;
    objective: string;
  }) {
    return this.aiService.analyzeCampaign(body);
  }

  @Post('analyze-url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analizar URL de producto o competidor con IA' })
  async analyzeUrl(@Body() body: { url: string; context?: string }) {
    try {
      return await this.aiService.analyzePattern(body.context || body.url, body.url);
    } catch {
      return { url: body.url, hook: null, score: 70, platform: 'reels', type: 'video' };
    }
  }

  @Post('optimize-campaign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Optimizar campaña existente con IA' })
  optimizeCampaign(@Body() body: any) {
    return this.aiService.optimizeCampaign(body);
  }
}
