import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PrismaService } from '../database/prisma.service'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check' })
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ])
  }
}
