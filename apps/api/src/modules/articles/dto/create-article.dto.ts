import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  MaxLength,
  IsBoolean,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ArticleStatus } from '@prisma/client'

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiPropertyOptional({ enum: ArticleStatus })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  readTime?: number
}
