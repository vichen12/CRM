import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { RolTipo } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('noticias')
export class NoticiasController {
  constructor(private noticiasService: NoticiasService) {}

  @Get()
  findAll(@Query('activas') activas: string, @CurrentUser() user: any) {
    // Vendedores solo ven activas, admin ve todas
    const soloActivas = user.rol !== RolTipo.admin || activas === 'true';
    return this.noticiasService.findAll(soloActivas);
  }

  @Post()
  @Roles(RolTipo.admin)
  crear(@Body() body: any, @CurrentUser() user: any) {
    return this.noticiasService.crear(body, user.id);
  }

  @Delete(':id')
  @Roles(RolTipo.admin)
  eliminar(@Param('id') id: string) {
    return this.noticiasService.eliminar(id);
  }
}
