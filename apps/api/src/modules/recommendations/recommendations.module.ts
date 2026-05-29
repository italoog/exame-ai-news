import { Module } from '@nestjs/common'
import { RecommendationsService } from './recommendations.service'
import { RecommendationsController } from './recommendations.controller'
import { DatabaseModule } from '../../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [RecommendationsService],
  controllers: [RecommendationsController],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
