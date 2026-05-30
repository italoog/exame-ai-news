import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { NotFoundException, ConflictException } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { PrismaService } from '../../database/prisma.service'

const mockCategoryBase = {
  id: 'cat-1',
  name: 'Tecnologia',
  slug: 'tecnologia',
  description: 'Notícias de tecnologia',
  color: '#ff0000',
  _count: { articles: 5 },
}

const mockPrismaService = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}

describe('CategoriesService', () => {
  let service: CategoriesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<CategoriesService>(CategoriesService)
    jest.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // findAll()
  // ─────────────────────────────────────────────
  describe('findAll', () => {
    it('deve retornar todas as categorias em ordem alfabética', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([mockCategoryBase])

      const result = await service.findAll()

      expect(result).toHaveLength(1)
      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
        include: { _count: { select: { articles: true } } },
      })
    })
  })

  // ─────────────────────────────────────────────
  // findBySlug()
  // ─────────────────────────────────────────────
  describe('findBySlug', () => {
    it('deve retornar categoria quando slug existe', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategoryBase)

      const result = await service.findBySlug('tecnologia')

      expect(result).toEqual(mockCategoryBase)
    })

    it('deve lançar NotFoundException quando slug não existe', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null)

      await expect(service.findBySlug('inexistente')).rejects.toThrow(NotFoundException)
    })
  })

  // ─────────────────────────────────────────────
  // create()
  // ─────────────────────────────────────────────
  describe('create', () => {
    it('deve criar categoria e retornar o registro criado', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null)
      mockPrismaService.category.create.mockResolvedValue(mockCategoryBase)

      const dto = { name: 'Tecnologia', slug: 'tecnologia', color: '#ff0000' }
      const result = await service.create(dto)

      expect(result).toEqual(mockCategoryBase)
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({ data: dto })
    })

    it('deve lançar ConflictException quando slug já existe', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategoryBase)

      await expect(
        service.create({ name: 'Tecnologia', slug: 'tecnologia', color: '#ff0000' }),
      ).rejects.toThrow(ConflictException)

      expect(mockPrismaService.category.create).not.toHaveBeenCalled()
    })
  })

  // ─────────────────────────────────────────────
  // update()
  // ─────────────────────────────────────────────
  describe('update', () => {
    it('deve atualizar categoria existente', async () => {
      const updated = { ...mockCategoryBase, name: 'Tech' }
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategoryBase)
      mockPrismaService.category.update.mockResolvedValue(updated)

      const result = await service.update('cat-1', { name: 'Tech' })

      expect(result.name).toBe('Tech')
      expect(mockPrismaService.category.update).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
        data: { name: 'Tech' },
      })
    })

    it('deve lançar NotFoundException quando categoria não existe', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null)

      await expect(service.update('inexistente', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  // ─────────────────────────────────────────────
  // remove()
  // ─────────────────────────────────────────────
  describe('remove', () => {
    it('deve deletar categoria existente', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategoryBase)
      mockPrismaService.category.delete.mockResolvedValue(mockCategoryBase)

      const result = await service.remove('cat-1')

      expect(result).toEqual(mockCategoryBase)
      expect(mockPrismaService.category.delete).toHaveBeenCalledWith({ where: { id: 'cat-1' } })
    })

    it('deve lançar NotFoundException quando categoria não existe', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null)

      await expect(service.remove('inexistente')).rejects.toThrow(NotFoundException)
    })
  })
})
