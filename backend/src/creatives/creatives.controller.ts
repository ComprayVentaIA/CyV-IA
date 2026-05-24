import {
  Controller, Get, Post, Delete, Body, Param,
  Query, UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreativesService } from './creatives.service';

@ApiTags('creatives')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('creatives')
export class CreativesController {
  constructor(private readonly creativesService: CreativesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar creativos del usuario' })
  findAll(@Request() req: any, @Query('campaignId') campaignId?: string) {
    return this.creativesService.findAll(req.user.id, campaignId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.creativesService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo creativo' })
  create(@Request() req: any, @Body() body: any) {
    return this.creativesService.create(req.user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.creativesService.remove(id, req.user.id);
  }
}
