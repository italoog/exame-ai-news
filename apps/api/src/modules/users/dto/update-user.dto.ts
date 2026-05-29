import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string
}
