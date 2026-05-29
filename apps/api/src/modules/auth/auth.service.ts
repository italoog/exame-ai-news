import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { PrismaService } from '../../database/prisma.service'
import type { RegisterDto } from './dto/register.dto'
import type { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
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
