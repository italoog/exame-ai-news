import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import type { CreateCategoryDto } from './dto/create-category.dto'
import type { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { articles: true } } },
    })
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { articles: true } } },
    })
    if (!category) throw new NotFoundException('Categoria não encontrada')
    return category
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { slug: dto.slug } })
    if (existing) throw new ConflictException('Slug já existe')
    return this.prisma.category.create({ data: dto })
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } })
    if (!category) throw new NotFoundException('Categoria não encontrada')
    return this.prisma.category.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } })
    if (!category) throw new NotFoundException('Categoria não encontrada')
    return this.prisma.category.delete({ where: { id } })
  }
}
