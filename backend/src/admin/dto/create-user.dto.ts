import {
  IsString, IsEmail, IsOptional, IsBoolean,
  IsArray, IsIn, MinLength, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'nuevo@cliente.com' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiPropertyOptional({ description: 'Si no se provee, se genera automáticamente' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ enum: ['client', 'subuser'], default: 'client' })
  @IsOptional()
  @IsIn(['client', 'subuser'])
  role?: string;

  @ApiPropertyOptional({ enum: ['starter', 'growth', 'scale'] })
  @IsOptional()
  @IsIn(['starter', 'growth', 'scale'])
  planName?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  extraPermissions?: string[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  sendWelcomeEmail?: boolean;
}
