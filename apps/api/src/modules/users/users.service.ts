import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import type { UpdateUserDto } from './dto/update-user.dto'
import type { Role } from '@prisma/client'

// Safe user fields (no password)
const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  bio: true,
  isActive: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: USER_SELECT })
  }

  async findByIdWithPassword(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async create(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({
      data,
      select: USER_SELECT,
    })
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException('Usuário não encontrado')

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: USER_SELECT,
    })
  }

  async updateRole(id: string, role: Role) {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException('Usuário não encontrado')
    return this.prisma.user.update({ where: { id }, data: { role }, select: USER_SELECT })
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ skip, take: limit, select: USER_SELECT, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count(),
    ])
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_SELECT,
        _count: { select: { articles: true, comments: true, favorites: true } },
      },
    })
    if (!user) throw new NotFoundException('Usuário não encontrado')
    return user
  }
}
