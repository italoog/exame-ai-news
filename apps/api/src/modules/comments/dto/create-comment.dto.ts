import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentId?: string
}
