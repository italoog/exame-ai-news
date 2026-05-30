import { Controller, Get, Post, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsInt, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

class TrackReadDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(86400)
  timeSpent?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get('for-you')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Recomendações personalizadas para o usuário' })
  async getForUser(@Request() req: Express.Request & { user?: { id: string } }) {
    if (req.user?.id) {
      return { data: await this.recommendationsService.getForUser(req.user.id) };
    }
    return { data: await this.recommendationsService.getPopular() };
  }

  @Get('popular')
  @ApiOperation({ summary: 'Artigos mais populares' })
  async getPopular(@Query('limit') limit?: string) {
    return {
      data: await this.recommendationsService.getPopular(limit ? +limit : 6),
    };
  }

  @Get('similar/:articleId')
  @ApiOperation({ summary: 'Artigos similares' })
  async getSimilar(@Param('articleId') articleId: string) {
    return { data: await this.recommendationsService.getSimilar(articleId) };
  }

  @Post('track/:articleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar leitura no histórico (com tempo e conclusão)' })
  async track(
    @Param('articleId') articleId: string,
    @Body() body: TrackReadDto,
    @Request() req: Express.Request & { user: { id: string } },
  ) {
    await this.recommendationsService.trackReadHistory(
      req.user.id,
      articleId,
      body.timeSpent,
      body.completed,
    );
    return { data: { tracked: true } };
  }
}
