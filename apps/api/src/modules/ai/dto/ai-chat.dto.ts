import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested, IsIn } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'] })
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant'

  @ApiProperty()
  @IsString()
  content: string
}

export class AiChatDto {
  @ApiProperty({ description: 'ID do artigo' })
  @IsString()
  @IsNotEmpty()
  articleId: string

  @ApiProperty({ description: 'Pergunta do usuário' })
  @IsString()
  @IsNotEmpty()
  question: string

  @ApiPropertyOptional({ type: [ChatMessageDto], description: 'Histórico de mensagens anteriores' })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  history?: ChatMessageDto[]
}
