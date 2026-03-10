import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolTipo } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('zonas')
export class ZonasController {
  constructor(private zonasService: ZonasService) {}

  @Get()
  findAll() {
    return this.zonasService.findAll();
  }

  @Post()
  @Roles(RolTipo.admin)
  crear(@Body() body: any) {
    return this.zonasService.crear(body);
  }
}
