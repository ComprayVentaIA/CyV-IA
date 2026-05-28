import { Module } from '@nestjs/common';
import { GenerativeService } from './generative.service';
import { GenerativeController } from './generative.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [GenerativeService],
  controllers: [GenerativeController],
  exports: [GenerativeService],
})
export class GenerativeModule {}
