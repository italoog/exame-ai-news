import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { UsersService } from '../users/users.service'
import { PrismaService } from '../../database/prisma.service'
import { EmailService } from './email.service'
import type { RegisterDto } from './dto/register.dto'
import type { LoginDto } from './dto/login.dto'
import type { ForgotPasswordDto } from './dto/forgot-password.dto'
import type { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email)
    if (existing) throw new ConflictException('E-mail já cadastrado')

    const hashed = await bcrypt.hash(dto.password, 10)
    const user = await this.usersService.create({
      ...dto,
      password: hashed,
    })

    return this.generateTokens(user.id, user.email, user.role)
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user) throw new UnauthorizedException('Credenciais inválidas')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Credenciais inválidas')

    if (!user.isActive) throw new UnauthorizedException('Conta desativada')

    return this.generateTokens(user.id, user.email, user.role)
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token } })
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido ou expirado')
    }

    // Rotate: delete old token
    await this.prisma.refreshToken.delete({ where: { token } })

    const user = await this.usersService.findById(stored.userId)
    if (!user || !user.isActive) throw new UnauthorizedException('Usuário não encontrado')

    return this.generateTokens(user.id, user.email, user.role)
  }

  async logout(token: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token } })
    return { message: 'Logout realizado com sucesso' }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email)
    // Sempre retorna sucesso para não revelar se o email existe
    if (!user) return { message: 'Se este e-mail estiver cadastrado, você receberá as instruções.' }

    // Invalida tokens anteriores
    await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    await this.prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    })

    const appUrl = this.config.get('APP_URL', 'http://localhost:3000')
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`

    await this.emailService.sendPasswordReset(user.email, user.name, resetUrl)

    return { message: 'Se este e-mail estiver cadastrado, você receberá as instruções.' }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true },
    })

    if (!record) throw new BadRequestException('Token inválido')
    if (record.expiresAt < new Date()) throw new BadRequestException('Token expirado. Solicite um novo.')
    if (record.usedAt) throw new BadRequestException('Token já utilizado')

    const hashed = await bcrypt.hash(dto.password, 10)

    await Promise.all([
      this.prisma.user.update({ where: { id: record.userId }, data: { password: hashed } }),
      this.prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      // Invalida todos os refresh tokens do usuário por segurança
      this.prisma.refreshToken.deleteMany({ where: { userId: record.userId } }),
    ])

    return { message: 'Senha redefinida com sucesso. Faça login com a nova senha.' }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) return null
    const valid = await bcrypt.compare(password, user.password)
    return valid ? user : null
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role }

    const accessToken = this.jwtService.sign(payload)

    const refreshExpiry = this.config.get('JWT_REFRESH_EXPIRES_IN', '7d')
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: refreshExpiry,
    })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt },
    })

    return { accessToken, refreshToken }
  }
}
