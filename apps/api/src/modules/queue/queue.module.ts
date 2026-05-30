/* eslint-disable @typescript-eslint/no-explicit-any */
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'

export const QUEUE_AI_SUMMARY = 'ai-summary'
export const QUEUE_ANALYTICS = 'analytics'
export const QUEUE_EMAIL = 'email'
export const QUEUE_TRENDING = 'trending'
export const QUEUE_RECOMMENDATIONS = 'recommendations'

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL');
        let connection: { host: string; port: number; password?: string; username?: string };
        if (redisUrl) {
          const parsed = new URL(redisUrl);
          connection = {
            host: parsed.hostname,
            port: parseInt(parsed.port || '6379', 10),
            password: parsed.password || undefined,
            username: parsed.username || undefined,
          };
        } else {
          connection = {
            host: config.get('REDIS_HOST', 'localhost'),
            port: config.get<number>('REDIS_PORT', 6379),
          };
        }
        return {
          connection,
          defaultJobOptions: {
            removeOnComplete: 100,
            removeOnFail: 50,
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 },
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: QUEUE_AI_SUMMARY },
      { name: QUEUE_ANALYTICS },
      { name: QUEUE_EMAIL },
      { name: QUEUE_TRENDING },
      { name: QUEUE_RECOMMENDATIONS },
    ),
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature(
      { name: QUEUE_AI_SUMMARY, adapter: BullMQAdapter as any },
      { name: QUEUE_ANALYTICS, adapter: BullMQAdapter as any },
      { name: QUEUE_EMAIL, adapter: BullMQAdapter as any },
      { name: QUEUE_TRENDING, adapter: BullMQAdapter as any },
      { name: QUEUE_RECOMMENDATIONS, adapter: BullMQAdapter as any },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
