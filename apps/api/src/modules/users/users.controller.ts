import {
  Controller, Get, Patch, Body, Param, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Role } from '@prisma/client'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil do usuário autenticado' })
  async getMe(@CurrentUser() user: { id: string }) {
    return this.usersService.getProfile(user.id)
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar perfil' })
  async updateMe(@CurrentUser() user: { id: string }, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Perfil público de um usuário' })
  async getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários (ADMIN)' })
  async findAll() {
    return this.usersService.findAll()
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alterar role de usuário (ADMIN)' })
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto.role)
  }
}
