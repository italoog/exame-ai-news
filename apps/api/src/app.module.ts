import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { DatabaseModule } from './database/database.module'
import { QueueModule } from './modules/queue/queue.module'
import { AiModule } from './modules/ai/ai.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { ArticlesModule } from './modules/articles/articles.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { TagsModule } from './modules/tags/tags.module'
import { CommentsModule } from './modules/comments/comments.module'
import { FavoritesModule } from './modules/favorites/favorites.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { AdminModule } from './modules/admin/admin.module'
import { RecommendationsModule } from './modules/recommendations/recommendations.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { HealthModule } from './health/health.module'
import { envValidationSchema } from './config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 60000, limit: 60 },
      { name: 'long', ttl: 60000 * 60, limit: 1000 },
    ]),
    DatabaseModule,
    QueueModule,
    AiModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ArticlesModule,
    CategoriesModule,
    TagsModule,
    CommentsModule,
    FavoritesModule,
    AnalyticsModule,
    AdminModule,
    RecommendationsModule,
    NotificationsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
