import { Injectable, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { EmailService } from '../auth/email.service'
import type { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto'

@Injectable()
export class NewsletterService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async subscribe(dto: SubscribeNewsletterDto) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: dto.email },
    })

    if (existing) {
      throw new ConflictException('Este e-mail já está inscrito na newsletter')
    }

    await this.prisma.newsletterSubscriber.create({
      data: { email: dto.email },
    })

    // Dispara o e-mail de boas-vindas sem bloquear a resposta
    this.emailService.sendNewsletterWelcome(dto.email).catch(() => null)

    return { message: 'Inscrição realizada com sucesso! Verifique seu e-mail.' }
  }
}
