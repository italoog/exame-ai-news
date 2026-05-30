import { PartialType } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, Matches } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CreateArticleDto } from './create-article.dto'

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(250)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug deve conter apenas letras minúsculas, números e hífens' })
  slug?: string
}
