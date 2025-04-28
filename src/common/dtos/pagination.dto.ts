import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {

  @ApiProperty({
    example: 10,
    description: 'Number of items to return',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    example: 0,
    description: 'Number of items to skip',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  offset?: number;
}