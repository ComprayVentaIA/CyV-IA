import {
  Controller, Get, Post, Delete,
  Body, Param, UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IntegrationsService } from './integrations.service';

const VALID_TYPES = new Set(['meta', 'whatsapp', 'stripe', 'instagram']);

@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly svc: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar integraciones del usuario' })
  findAll(@Request() req: any) {
    return this.svc.findAll(req.user.id);
  }

  @Post(':type')
  @ApiOperation({ summary: 'Guardar integración (upsert)' })
  async upsert(
    @Request() req: any,
    @Param('type') type: string,
    @Body() config: Record<string, string>,
  ) {
    if (!VALID_TYPES.has(type)) {
      return { error: 'Tipo de integración inválido' };
    }
    return this.svc.upsert(req.user.id, type, config);
  }

  @Delete(':type')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desconectar integración' })
  disconnect(@Request() req: any, @Param('type') type: string) {
    return this.svc.disconnect(req.user.id, type);
  }
}
