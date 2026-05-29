import { Injectable } from '@nestjs/common'
import {
  NotificationsGateway,
  BreakingNewsPayload,
} from './notifications.gateway'

@Injectable()
export class NotificationsService {
  constructor(private gateway: NotificationsGateway) {}

  sendBreakingNews(news: BreakingNewsPayload) {
    this.gateway.broadcastBreakingNews(news)
  }

  sendTrendingUpdate(articles: unknown[]) {
    this.gateway.broadcastTrending(articles)
  }

  getConnectedCount(): number {
    return this.gateway.getConnectedCount()
  }
}
