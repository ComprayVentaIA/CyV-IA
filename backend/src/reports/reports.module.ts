import { Module } from '@nestjs/common';
import { ReportsScheduler } from './reports.scheduler';
import { ReportsController } from './reports.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [ReportsController],
  providers: [ReportsScheduler],
  exports: [ReportsScheduler],
})
export class ReportsModule {}
