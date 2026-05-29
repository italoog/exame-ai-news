import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  slug: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string
}
