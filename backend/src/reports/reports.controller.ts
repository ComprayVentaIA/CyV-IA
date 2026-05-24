import { Controller, Get, Post, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsScheduler } from './reports.scheduler';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsScheduler: ReportsScheduler) {}

  @Get()
  @ApiOperation({ summary: 'Listar reportes del usuario' })
  findAll(@Request() req: any, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.reportsScheduler.getUserReports(req.user.id, +page, +limit);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generar reporte on-demand' })
  generate(@Request() req: any) {
    return this.reportsScheduler.generateReportForUser({
      id: req.user.id,
      email: req.user.email,
      full_name: req.user.fullName,
    });
  }
}
