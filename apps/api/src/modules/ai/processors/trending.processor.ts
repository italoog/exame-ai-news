import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { QUEUE_TRENDING } from '../../queue/queue.module';

@Processor(QUEUE_TRENDING)
export class TrendingProcessor extends WorkerHost {
  private readonly logger = new Logger(TrendingProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(_job: Job): Promise<void> {
    this.logger.log('Calculando artigos trending...');

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Calcula score: views / horas desde publicação (evita artigos antigos com views acumuladas)
    const articles = await this.prisma.article.findMany({
      where: { status: 'PUBLISHED', publishedAt: { gte: sevenDaysAgo } },
      select: { id: true, title: true, viewCount: true, publishedAt: true },
    });

    const scored = articles
      .map((a) => {
        const ageHours = Math.max(1, (Date.now() - new Date(a.publishedAt!).getTime()) / 3_600_000);
        return { ...a, score: a.viewCount / ageHours };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    this.logger.log(
      `Trending calculado: ${scored.length} artigos | top: "${scored[0]?.title ?? 'nenhum'}" (score ${scored[0]?.score.toFixed(2) ?? 0})`,
    );
  }
}
