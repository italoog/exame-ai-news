import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuggestTagsDto {
  @ApiProperty({ description: 'Título do artigo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Conteúdo HTML do artigo' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
