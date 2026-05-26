import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, Request,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiTrainingService, CreatePatternDto } from './ai-training.service';

@ApiTags('ai-training')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-training')
export class AiTrainingController {
  constructor(private readonly svc: AiTrainingService) {}

  @Get('patterns')
  @ApiOperation({ summary: 'Listar patrones de IA' })
  findAll(
    @Query('platform') platform?: string,
    @Query('search') search?: string,
    @Query('active') active?: string,
  ) {
    return this.svc.findAll({
      platform,
      search,
      active: active !== undefined ? active === 'true' : undefined,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas del sistema de entrenamiento' })
  getStats() {
    return this.svc.getStats();
  }

  @Post('patterns')
  @ApiOperation({ summary: 'Crear patrón de entrenamiento' })
  create(@Request() req: any, @Body() dto: CreatePatternDto) {
    return this.svc.create(req.user.id, dto);
  }

  @Put('patterns/:id')
  @ApiOperation({ summary: 'Actualizar patrón' })
  update(@Param('id') id: string, @Body() dto: Partial<CreatePatternDto> & { active?: boolean }) {
    return this.svc.update(id, dto);
  }

  @Delete('patterns/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar patrón' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analizar contenido y extraer patrón con IA' })
  analyze(@Body() body: { content: string; sourceUrl?: string }) {
    return this.svc.analyzeAndExtract(body.content, body.sourceUrl);
  }

  @Post('patterns/:id/use')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Registrar uso de patrón' })
  incrementUses(@Param('id') id: string) {
    return this.svc.incrementUses(id);
  }
}
