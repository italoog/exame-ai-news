import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { AiService } from './ai.service'
import { AiController } from './ai.controller'
import { AiSummaryProcessor } from './processors/ai-summary.processor'
import { TrendingProcessor } from './processors/trending.processor'
import { QUEUE_AI_SUMMARY, QUEUE_TRENDING } from '../queue/queue.module'
import { DatabaseModule } from '../../database/database.module'

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_AI_SUMMARY },
      { name: QUEUE_TRENDING },
    ),
    DatabaseModule,
  ],
  controllers: [AiController],
  providers: [AiService, AiSummaryProcessor, TrendingProcessor],
  exports: [AiService],
})
export class AiModule {}
