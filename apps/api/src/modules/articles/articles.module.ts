import { Module } from '@nestjs/common'
import { ArticlesController } from './articles.controller'
import { ArticlesService } from './articles.service'
import { AiModule } from '../ai/ai.module'
import { CategoriesModule } from '../categories/categories.module'
import { TagsModule } from '../tags/tags.module'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [AiModule, CategoriesModule, TagsModule, NotificationsModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
