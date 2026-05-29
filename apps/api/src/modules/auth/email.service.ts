import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)
  private resend: Resend | null = null
  private fromAddress: string

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY')
    this.fromAddress = this.config.get<string>('EMAIL_FROM', 'noreply@exame-ai.news')

    if (apiKey) {
      this.resend = new Resend(apiKey)
    } else {
      this.logger.warn('RESEND_API_KEY não configurado — emails serão logados no console')
    }
  }

  async sendPasswordReset(to: string, name: string, resetUrl: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Inter, Arial, sans-serif; background: #f4f4f5; margin: 0; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.08);">
          <div style="background: #E10600; padding: 24px 32px;">
            <p style="color: #fff; font-size: 20px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">
              EXAME <span style="font-weight: 400;">AI</span>
            </p>
          </div>
          <div style="padding: 32px;">
            <h1 style="font-size: 22px; font-weight: 700; color: #18181b; margin: 0 0 8px;">Redefinir senha</h1>
            <p style="color: #71717a; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              Olá, <strong style="color: #18181b;">${name}</strong>. Recebemos uma solicitação para redefinir a senha da sua conta.
            </p>
            <a href="${resetUrl}"
               style="display: inline-block; background: #E10600; color: #fff; font-weight: 600; font-size: 15px;
                      padding: 12px 28px; border-radius: 8px; text-decoration: none;">
              Redefinir senha
            </a>
            <p style="color: #a1a1aa; font-size: 13px; margin: 24px 0 0;">
              Este link expira em <strong>1 hora</strong>. Se você não solicitou a redefinição, ignore este e-mail.
            </p>
            <hr style="border: none; border-top: 1px solid #f4f4f5; margin: 24px 0 16px;">
            <p style="color: #d4d4d8; font-size: 11px; margin: 0;">
              © ${new Date().getFullYear()} EXAME AI NEWS — plataforma demonstrativa
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    if (!this.resend) {
      // Desenvolvimento sem API key — loga o link no terminal
      this.logger.log(`[DEV] Link de reset para ${to}: ${resetUrl}`)
      return
    }

    const { error } = await this.resend.emails.send({
      from: this.fromAddress,
      to,
      subject: 'Redefinir senha — EXAME AI NEWS',
      html,
    })

    if (error) {
      this.logger.error(`Erro ao enviar email para ${to}: ${error.message}`)
      throw new Error('Falha ao enviar e-mail de recuperação')
    }
  }

  async sendNewsletterWelcome(to: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Inter, Arial, sans-serif; background: #f4f4f5; margin: 0; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.08);">
          <div style="background: #E10600; padding: 24px 32px;">
            <p style="color: #fff; font-size: 20px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">
              EXAME <span style="font-weight: 400;">AI</span>
            </p>
          </div>
          <div style="padding: 32px;">
            <h1 style="font-size: 22px; font-weight: 700; color: #18181b; margin: 0 0 8px;">Bem-vindo à newsletter!</h1>
            <p style="color: #71717a; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
              Você agora receberá as principais análises do mercado com resumos gerados por IA direto neste e-mail.
            </p>
            <p style="color: #71717a; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              Fique à frente do mercado com conteúdo selecionado e resumido pela inteligência artificial do <strong style="color: #18181b;">EXAME AI NEWS</strong>.
            </p>
            <a href="${this.config.get('APP_URL', 'http://localhost:3000')}"
               style="display: inline-block; background: #E10600; color: #fff; font-weight: 600; font-size: 15px;
                      padding: 12px 28px; border-radius: 8px; text-decoration: none;">
              Ler as últimas notícias
            </a>
            <hr style="border: none; border-top: 1px solid #f4f4f5; margin: 24px 0 16px;">
            <p style="color: #d4d4d8; font-size: 11px; margin: 0;">
              © ${new Date().getFullYear()} EXAME AI NEWS — plataforma demonstrativa
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    if (!this.resend) {
      this.logger.log(`[DEV] Newsletter: inscrito ${to}`)
      return
    }

    const { error } = await this.resend.emails.send({
      from: this.fromAddress,
      to,
      subject: 'Bem-vindo à newsletter do EXAME AI NEWS!',
      html,
    })

    if (error) {
      this.logger.error(`Erro ao enviar welcome email para ${to}: ${error.message}`)
    }
  }
}
