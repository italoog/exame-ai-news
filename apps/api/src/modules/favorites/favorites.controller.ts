import { Controller, Get, Post, Param, UseGuards, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { FavoritesService } from './favorites.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Artigos favoritos do usuário' })
  findAll(
    @CurrentUser() user: { id: string },
    @Query('page') page?: number,
  ) {
    return this.favoritesService.findByUser(user.id, page ? Number(page) : 1)
  }

  @Post(':articleId')
  @ApiOperation({ summary: 'Adicionar/remover favorito' })
  toggle(
    @Param('articleId') articleId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.favoritesService.toggle(articleId, user.id)
  }

  @Get(':articleId/check')
  @ApiOperation({ summary: 'Verificar se artigo é favorito' })
  check(
    @Param('articleId') articleId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.favoritesService.check(articleId, user.id)
  }
}
