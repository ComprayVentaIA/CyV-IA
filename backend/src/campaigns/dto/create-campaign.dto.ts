import {
  IsString, IsOptional, IsNumber, IsIn,
  Min, Max, IsUUID, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Campaña Verano 2025' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  metaAccountId?: string;

  @ApiPropertyOptional({ enum: ['whatsapp', 'traffic', 'leads', 'conversions'], default: 'whatsapp' })
  @IsOptional()
  @IsIn(['whatsapp', 'traffic', 'leads', 'conversions'])
  objective?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 10000, description: 'Presupuesto diario en USD' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000)
  dailyBudgetUsd?: number;

  @ApiPropertyOptional({ example: '+5491155556666' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  whatsappNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  whatsappMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  targeting?: Record<string, any>;
}
