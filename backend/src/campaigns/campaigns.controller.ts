import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard, RequirePermission } from '../common/guards/index';
import { CampaignLimitGuard } from '../common/guards/index';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { MetaAdsService } from '../meta-ads/meta-ads.service';
import { AiService } from '../ai/ai.service';
import { PaymentsService } from '../payments/payments.service';

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly metaAdsService: MetaAdsService,
    private readonly aiService: AiService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get()
  @RequirePermission('campaigns.read')
  @ApiOperation({ summary: 'Listar campañas del usuario' })
  findAll(@Request() req: any, @Query('status') status?: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.campaignsService.findAll(req.user.id, { status, page: +page, limit: +limit });
  }

  @Get(':id')
  @RequirePermission('campaigns.read')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.findOne(id, req.user.id);
  }

  @Post()
  @RequirePermission('campaigns.create')
  @UseGuards(CampaignLimitGuard)
  @ApiOperation({ summary: 'Crear nueva campaña' })
  create(@Request() req: any, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(req.user.id, dto);
  }

  @Post(':id/analyze')
  @RequirePermission('ai.analyze')
  @ApiOperation({ summary: 'Analizar producto con IA y generar estrategia' })
  async analyze(@Param('id') id: string, @Request() req: any) {
    const campaign = await this.campaignsService.findOne(id, req.user.id);
    const strategy = await this.aiService.analyzeCampaign({
      productName: campaign.name,
      description: campaign.description,
      price: campaign.product?.price_cents ? campaign.product.price_cents / 100 : undefined,
      objective: campaign.objective,
    });
    return this.campaignsService.saveAiStrategy(id, strategy);
  }

  @Post(':id/publish')
  @RequirePermission('campaigns.publish', 'meta.publish')
  @ApiOperation({ summary: 'Publicar campaña en Meta Ads' })
  publish(@Param('id') id: string, @Request() req: any) {
    return this.metaAdsService.publishCampaign(id, req.user.id);
  }

  @Post(':id/pause')
  @RequirePermission('campaigns.update')
  pause(@Param('id') id: string, @Request() req: any) {
    return this.metaAdsService.toggleCampaign(id, req.user.id, 'pause');
  }

  @Post(':id/resume')
  @RequirePermission('campaigns.update')
  resume(@Param('id') id: string, @Request() req: any) {
    return this.metaAdsService.toggleCampaign(id, req.user.id, 'resume');
  }

  @Post(':id/duplicate')
  @RequirePermission('campaigns.duplicate')
  @UseGuards(CampaignLimitGuard)
  @ApiOperation({ summary: 'Duplicar campaña existente' })
  duplicate(@Param('id') id: string, @Request() req: any) {
    return this.campaignsService.duplicate(id, req.user.id);
  }

  @Post(':id/optimize')
  @RequirePermission('ai.optimize')
  @ApiOperation({ summary: 'Generar sugerencias de optimización con IA' })
  async optimize(@Param('id') id: string, @Request() req: any) {
    const campaign = await this.campaignsService.findOne(id, req.user.id);
    return this.aiService.optimizeCampaign(campaign);
  }

  @Put(':id')
  @RequirePermission('campaigns.update')
  update(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateCampaignDto) {
    return this.campaignsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @RequirePermission('campaigns.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.campaignsService.remove(id, req.user.id);
  }

  @Get(':id/metrics')
  @RequirePermission('reports.read')
  @ApiOperation({ summary: 'Obtener métricas de campaña sincronizadas desde Meta' })
  async metrics(@Param('id') id: string, @Request() req: any) {
    await this.metaAdsService.syncCampaignMetrics(id);
    return this.campaignsService.findOne(id, req.user.id);
  }

  @Get('dashboard/summary')
  @RequirePermission('campaigns.read')
  @ApiOperation({ summary: 'Resumen del dashboard para el usuario' })
  dashboardSummary(@Request() req: any) {
    return this.campaignsService.getDashboardSummary(req.user.id);
  }
}
