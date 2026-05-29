import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import type { Request } from 'express'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Role } from '@prisma/client'

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post('event')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Registrar evento de analytics' })
  trackEvent(
    @Body() body: { eventType: string; articleId?: string },
    @CurrentUser() user: { id: string } | undefined,
    @Req() req: Request,
  ) {
    return this.analyticsService.trackEvent({
      ...body,
      userId: user?.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    })
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dashboard de analytics (ADMIN)' })
  getDashboard() {
    return this.analyticsService.getDashboard()
  }

  @Get('top-articles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Artigos mais lidos' })
  getTopArticles() {
    return this.analyticsService.getTopArticles()
  }
}
