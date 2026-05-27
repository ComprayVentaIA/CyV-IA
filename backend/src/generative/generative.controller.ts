import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerativeService } from './generative.service';

@ApiTags('generative')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('generative')
export class GenerativeController {
  constructor(private readonly svc: GenerativeService) {}

  @Post('image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generar imagen hiperrealista con FLUX via HuggingFace' })
  async generateImage(@Body() body: {
    product: string;
    style?: string;
    format?: '9:16' | '4:5' | '1:1';
    hook?: string;
  }) {
    const imageBase64 = await this.svc.generateImage(
      body.product ?? 'producto',
      body.style ?? 'Producto hero',
      body.format ?? '9:16',
      body.hook,
    );
    return { data: { imageBase64 } };
  }

  @Post('video')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Animar imagen con efectos cinematográficos via ffmpeg' })
  async generateVideo(@Body() body: {
    imageBase64: string;
    format?: '9:16' | '4:5' | '1:1';
    movement?: 'zoom_in' | 'zoom_out' | 'pan_right' | 'pan_left';
  }) {
    const videoBase64 = await this.svc.generateVideo(
      body.imageBase64,
      body.format ?? '9:16',
      body.movement ?? 'zoom_in',
    );
    return { data: { videoBase64 } };
  }
}
