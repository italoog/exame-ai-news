import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'

export interface BreakingNewsPayload {
  id: string
  title: string
  slug: string
  category: string
}

export interface NotificationPayload {
  type: 'breaking_news' | 'new_article' | 'trending'
  payload: unknown
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/ws',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server

  private readonly logger = new Logger(NotificationsGateway.name)
  private connectedClients = 0

  afterInit(_server: Server) {
    this.logger.log('WebSocket Gateway inicializado')
  }

  handleConnection(client: Socket) {
    this.connectedClients++
    this.logger.debug(
      `Cliente conectado: ${client.id} (total: ${this.connectedClients})`,
    )
  }

  handleDisconnect(client: Socket) {
    this.connectedClients--
    this.logger.debug(
      `Cliente desconectado: ${client.id} (total: ${this.connectedClients})`,
    )
  }

  @SubscribeMessage('subscribe_category')
  handleSubscribeCategory(
    @MessageBody() category: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(`category:${category}`)
    return { event: 'subscribed', data: { category } }
  }

  @SubscribeMessage('unsubscribe_category')
  handleUnsubscribeCategory(
    @MessageBody() category: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.leave(`category:${category}`)
    return { event: 'unsubscribed', data: { category } }
  }

  broadcastBreakingNews(news: BreakingNewsPayload) {
    this.server.emit('breaking_news', news)
    this.logger.log(`Breaking news enviada: ${news.title}`)
  }

  broadcastToCategory(categorySlug: string, notification: NotificationPayload) {
    this.server
      .to(`category:${categorySlug}`)
      .emit('notification', notification)
  }

  broadcastTrending(articles: unknown[]) {
    this.server.emit('trending_update', { articles })
  }

  getConnectedCount(): number {
    return this.connectedClients
  }
}
