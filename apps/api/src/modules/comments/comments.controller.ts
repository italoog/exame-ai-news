import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Role } from '@prisma/client'

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('articles/:articleId/comments')
  @ApiOperation({ summary: 'Listar comentários de um artigo' })
  findByArticle(@Param('articleId') articleId: string) {
    return this.commentsService.findByArticle(articleId)
  }

  @Post('articles/:articleId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar comentário' })
  create(
    @Param('articleId') articleId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.commentsService.create(articleId, dto, user.id)
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar comentário próprio' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.commentsService.update(id, dto.content, user.id)
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover comentário' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.commentsService.remove(id, user.id, user.role)
  }

  @Post('comments/:id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Curtir/descurtir comentário' })
  toggleLike(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.commentsService.toggleLike(id, user.id)
  }
}
