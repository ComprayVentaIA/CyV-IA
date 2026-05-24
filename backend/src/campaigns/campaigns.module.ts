import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { MetaAdsModule } from '../meta-ads/meta-ads.module';
import { AiModule } from '../ai/ai.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [MetaAdsModule, AiModule, PaymentsModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
