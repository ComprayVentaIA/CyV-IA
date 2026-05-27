import { Module } from '@nestjs/common';
import { GenerativeService } from './generative.service';
import { GenerativeController } from './generative.controller';

@Module({
  providers: [GenerativeService],
  controllers: [GenerativeController],
  exports: [GenerativeService],
})
export class GenerativeModule {}
