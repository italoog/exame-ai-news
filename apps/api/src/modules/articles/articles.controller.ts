import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ArticlesService } from './articles.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ArticleFiltersDto } from './dto/article-filters.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Role } from '@prisma/client'

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Listar artigos com filtros e paginação' })
  findAll(
    @Query() filters: ArticleFiltersDto,
    @CurrentUser() user?: { role: Role },
  ) {
    return this.articlesService.findAll(filters, user?.role)
  }

  @Get('trending')
  @ApiOperation({ summary: 'Artigos em alta' })
  findTrending() {
    return this.articlesService.findTrending()
  }

  @Get('featured')
  @ApiOperation({ summary: 'Artigos em destaque' })
  findFeatured() {
    return this.articlesService.findFeatured()
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Artigo completo por slug' })
  findBySlug(
    @Param('slug') slug: string,
    @CurrentUser() user?: { id: string },
  ) {
    return this.articlesService.findBySlug(slug, user?.id)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EDITOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar artigo (EDITOR, ADMIN)' })
  create(
    @Body() dto: CreateArticleDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.articlesService.create(dto, user.id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EDITOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar artigo' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.articlesService.update(id, dto, user.id, user.role)
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EDITOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publicar artigo' })
  publish(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.articlesService.publish(id, user.id, user.role)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EDITOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Arquivar artigo' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.articlesService.remove(id, user.id, user.role)
  }
}
