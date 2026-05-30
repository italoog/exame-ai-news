import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { Response } from 'express'
import { AiService } from './ai.service'
import { AiChatDto } from './dto/ai-chat.dto'

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @HttpCode(200)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Chat com IA sobre um artigo (streaming)' })
  async chat(@Body() dto: AiChatDto, @Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('X-Accel-Buffering', 'no')

    try {
      await this.aiService.streamChat(
        dto.articleId,
        dto.question,
        dto.history ?? [],
        res,
      )
    } catch {
      if (!res.headersSent) {
        res.status(500).json({ message: 'Serviço de IA indisponível' })
        return
      }
    } finally {
      res.end()
    }
  }
}
