import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MetaAdsService } from './meta-ads.service';
import { ConnectMetaAccountDto } from './dto/connect-meta-account.dto';

@ApiTags('meta-ads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meta-ads')
export class MetaAdsController {
  constructor(private readonly metaAdsService: MetaAdsService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Conectar cuenta de Meta Ads' })
  connect(@Request() req: any, @Body() dto: ConnectMetaAccountDto) {
    return this.metaAdsService.connectAccount(req.user.id, dto);
  }

  @Get('accounts')
  @ApiOperation({ summary: 'Listar cuentas de Meta Ads conectadas' })
  getAccounts(@Request() req: any) {
    return this.metaAdsService.getAccounts(req.user.id);
  }
}
