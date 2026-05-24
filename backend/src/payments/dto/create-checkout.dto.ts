import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutDto {
  @ApiProperty({ enum: ['starter', 'growth', 'scale'] })
  @IsIn(['starter', 'growth', 'scale'])
  plan: string;
}
