import { Module } from '@nestjs/common';
import { CreativesService } from './creatives.service';
import { CreativesController } from './creatives.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [CreativesController],
  providers: [CreativesService],
  exports: [CreativesService],
})
export class CreativesModule {}
