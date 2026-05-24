import {
  IsString, IsEmail, IsOptional, IsArray, IsIn, MinLength, MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ enum: ['client', 'subuser'] })
  @IsOptional()
  @IsIn(['client', 'subuser'])
  role?: string;

  @ApiPropertyOptional({ enum: ['active', 'suspended', 'blocked'] })
  @IsOptional()
  @IsIn(['active', 'suspended', 'blocked'])
  status?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  extraPermissions?: string[];
}
