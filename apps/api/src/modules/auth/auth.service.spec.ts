import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { PrismaService } from '../../database/prisma.service'
import { EmailService } from './email.service'
import * as bcrypt from 'bcrypt'

const mockUsersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}

const mockJwtService = {
  sign: jest.fn(),
}

const mockConfigService = {
  get: jest.fn(),
}

const mockPrismaService = {
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  passwordResetToken: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
}

const mockEmailService = {
  sendPasswordReset: jest.fn(),
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jest.clearAllMocks()
    mockJwtService.sign.mockReturnValue('mocked-token')
    mockConfigService.get.mockReturnValue('test-value')
    mockPrismaService.refreshToken.create.mockResolvedValue({})
  })

  // ─────────────────────────────────────────────
  // register()
  // ─────────────────────────────────────────────
  describe('register', () => {
    it('deve lançar ConflictException se o email já estiver cadastrado', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: '1', email: 'test@test.com' })

      await expect(
        service.register({ name: 'Teste', email: 'test@test.com', password: 'pass123' }),
      ).rejects.toThrow(ConflictException)
    })

    it('deve criar o usuário com a senha hasheada', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null)
      mockUsersService.create.mockResolvedValue({ id: 'user-1', email: 'novo@test.com', role: 'USER' })

      await service.register({ name: 'Novo', email: 'novo@test.com', password: 'senha123' })

      const createCall = mockUsersService.create.mock.calls[0][0] as { password: string }
      expect(createCall.password).not.toBe('senha123')
      expect(typeof createCall.password).toBe('string')
      expect(createCall.password.length).toBeGreaterThan(20)
    })

    it('deve retornar accessToken e refreshToken ao registrar com sucesso', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null)
      mockUsersService.create.mockResolvedValue({ id: 'user-1', email: 'novo@test.com', role: 'USER' })

      const result = await service.register({ name: 'Novo', email: 'novo@test.com', password: 'senha123' })

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })
  })

  // ─────────────────────────────────────────────
  // login()
  // ─────────────────────────────────────────────
  describe('login', () => {
    it('deve lançar UnauthorizedException para usuário não encontrado', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null)

      await expect(
        service.login({ email: 'naoexiste@test.com', password: 'qualquer' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('deve lançar UnauthorizedException para senha incorreta', async () => {
      const hashedPassword = await bcrypt.hash('senhaCorreta', 10)
      mockUsersService.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: hashedPassword,
        isActive: true,
        role: 'USER',
      })

      await expect(
        service.login({ email: 'test@test.com', password: 'senhaErrada' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('deve lançar UnauthorizedException para conta desativada', async () => {
      const hashedPassword = await bcrypt.hash('senha123', 10)
      mockUsersService.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: hashedPassword,
        isActive: false,
        role: 'USER',
      })

      await expect(
        service.login({ email: 'test@test.com', password: 'senha123' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('deve retornar accessToken e refreshToken para credenciais válidas', async () => {
      const hashedPassword = await bcrypt.hash('senha123', 10)
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        password: hashedPassword,
        isActive: true,
        role: 'USER',
      })

      const result = await service.login({ email: 'test@test.com', password: 'senha123' })

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })

    it('deve armazenar o refresh token no banco após login bem-sucedido', async () => {
      const hashedPassword = await bcrypt.hash('senha123', 10)
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        password: hashedPassword,
        isActive: true,
        role: 'USER',
      })

      await service.login({ email: 'test@test.com', password: 'senha123' })

      expect(mockPrismaService.refreshToken.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ userId: 'user-1' }) }),
      )
    })
  })

  // ─────────────────────────────────────────────
  // refresh()
  // ─────────────────────────────────────────────
  describe('refresh', () => {
    it('deve lançar UnauthorizedException para token não encontrado', async () => {
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(null)

      await expect(service.refresh('token-invalido')).rejects.toThrow(UnauthorizedException)
    })

    it('deve lançar UnauthorizedException para token expirado', async () => {
      const pastDate = new Date(Date.now() - 1000)
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        token: 'token-expirado',
        userId: 'user-1',
        expiresAt: pastDate,
      })

      await expect(service.refresh('token-expirado')).rejects.toThrow(UnauthorizedException)
    })

    it('deve lançar UnauthorizedException se o usuário associado não existir', async () => {
      const futureDate = new Date(Date.now() + 86_400_000)
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        token: 'token-valido',
        userId: 'user-inexistente',
        expiresAt: futureDate,
      })
      mockPrismaService.refreshToken.delete.mockResolvedValue({})
      mockUsersService.findById.mockResolvedValue(null)

      await expect(service.refresh('token-valido')).rejects.toThrow(UnauthorizedException)
    })

    it('deve realizar rotação de token e retornar novos tokens', async () => {
      const futureDate = new Date(Date.now() + 86_400_000)
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        token: 'token-valido',
        userId: 'user-1',
        expiresAt: futureDate,
      })
      mockPrismaService.refreshToken.delete.mockResolvedValue({})
      mockUsersService.findById.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        isActive: true,
      })

      const result = await service.refresh('token-valido')

      expect(mockPrismaService.refreshToken.delete).toHaveBeenCalledWith({
        where: { token: 'token-valido' },
      })
      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })
  })

  // ─────────────────────────────────────────────
  // logout()
  // ─────────────────────────────────────────────
  describe('logout', () => {
    it('deve chamar deleteMany com o token fornecido', async () => {
      mockPrismaService.refreshToken.deleteMany.mockResolvedValue({ count: 1 })

      const result = await service.logout('meu-token')

      expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { token: 'meu-token' },
      })
      expect(result).toHaveProperty('message')
    })

    it('não deve lançar erro quando o token não existir (idempotente)', async () => {
      mockPrismaService.refreshToken.deleteMany.mockResolvedValue({ count: 0 })

      await expect(service.logout('token-inexistente')).resolves.not.toThrow()
    })
  })
})
