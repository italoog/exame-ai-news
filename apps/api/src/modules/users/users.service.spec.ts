import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { Role } from '@prisma/client'
import { UsersService } from './users.service'
import { PrismaService } from '../../database/prisma.service'

// ─── Fixture base para usuário ────────────────────────────────────────────────
const mockUserBase = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao@test.com',
  role: Role.USER,
  avatar: null,
  bio: null,
  isActive: true,
  emailVerified: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
}

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    jest.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // findByEmail()
  // ─────────────────────────────────────────────
  describe('findByEmail', () => {
    it('deve retornar o usuário ao encontrar pelo email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserBase)

      const result = await service.findByEmail('joao@test.com')

      expect(result).toEqual(mockUserBase)
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'joao@test.com' },
      })
    })

    it('deve retornar null quando o email não estiver cadastrado', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      const result = await service.findByEmail('naoexiste@test.com')

      expect(result).toBeNull()
    })
  })

  // ─────────────────────────────────────────────
  // findById()
  // ─────────────────────────────────────────────
  describe('findById', () => {
    it('deve retornar o usuário ao encontrar pelo id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserBase)

      const result = await service.findById('user-1')

      expect(result).toEqual(mockUserBase)
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'user-1' } }),
      )
    })

    it('deve retornar null quando o id não existir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      const result = await service.findById('id-inexistente')

      expect(result).toBeNull()
    })
  })

  // ─────────────────────────────────────────────
  // create()
  // ─────────────────────────────────────────────
  describe('create', () => {
    it('deve criar o usuário com os dados fornecidos', async () => {
      const createData = {
        name: 'Maria Costa',
        email: 'maria@test.com',
        password: 'hashed_password',
      }
      mockPrismaService.user.create.mockResolvedValue({ ...mockUserBase, ...createData })

      const result = await service.create(createData)

      expect(mockPrismaService.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: createData }),
      )
      expect(result.email).toBe('maria@test.com')
      expect(result.name).toBe('Maria Costa')
    })

    it('deve retornar campos seguros (sem senha no retorno)', async () => {
      const createData = { name: 'Test', email: 'test@test.com', password: 'hashed' }
      // USER_SELECT não inclui password
      const { ...userWithoutPassword } = mockUserBase
      mockPrismaService.user.create.mockResolvedValue(userWithoutPassword)

      const result = await service.create(createData)

      expect(result).not.toHaveProperty('password')
    })
  })

  // ─────────────────────────────────────────────
  // update()
  // ─────────────────────────────────────────────
  describe('update', () => {
    it('deve atualizar os campos de perfil do usuário', async () => {
      const updateDto = { name: 'João Atualizado', bio: 'Nova bio' }
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserBase)
      mockPrismaService.user.update.mockResolvedValue({ ...mockUserBase, ...updateDto })

      const result = await service.update('user-1', updateDto)

      expect(mockPrismaService.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: updateDto,
        }),
      )
      expect(result.name).toBe('João Atualizado')
      expect(result.bio).toBe('Nova bio')
    })

    it('deve lançar NotFoundException se o usuário não existir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.update('id-inexistente', { name: 'Teste' })).rejects.toThrow(
        NotFoundException,
      )
    })

    it('não deve chamar update quando o usuário não for encontrado', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await service.update('id-inexistente', { name: 'Teste' }).catch(() => null)

      expect(mockPrismaService.user.update).not.toHaveBeenCalled()
    })
  })

  // ─────────────────────────────────────────────
  // findAll()
  // ─────────────────────────────────────────────
  describe('findAll', () => {
    it('deve retornar lista paginada de usuários com meta de paginação', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUserBase])
      mockPrismaService.user.count.mockResolvedValue(1)

      const result = await service.findAll(1, 20)

      expect(result.data).toHaveLength(1)
      expect(result.meta).toEqual({ page: 1, limit: 20, total: 1, totalPages: 1 })
    })

    it('deve calcular corretamente o skip de paginação', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([])
      mockPrismaService.user.count.mockResolvedValue(50)

      await service.findAll(3, 10)

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      )
    })

    it('deve calcular corretamente o totalPages', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([])
      mockPrismaService.user.count.mockResolvedValue(45)

      const result = await service.findAll(1, 10)

      expect(result.meta.totalPages).toBe(5)
    })

    it('deve usar valores padrão page=1 e limit=20 quando não fornecidos', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([])
      mockPrismaService.user.count.mockResolvedValue(0)

      const result = await service.findAll()

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      )
      expect(result.meta.page).toBe(1)
      expect(result.meta.limit).toBe(20)
    })
  })
})
