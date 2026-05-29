import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { TagsService } from './tags.service'

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tags' })
  findAll() {
    return this.tagsService.findAll()
  }

  @Get('popular')
  @ApiOperation({ summary: 'Tags mais usadas' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findPopular(@Query('limit') limit?: number) {
    return this.tagsService.findPopular(limit ? Number(limit) : 20)
  }
}
