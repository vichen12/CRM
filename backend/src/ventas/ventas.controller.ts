import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ventas')
export class VentasController {
  constructor(private ventasService: VentasService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.ventasService.findAll(user);
  }

  @Get('resumen')
  resumen(
    @CurrentUser() user: any,
    @Query('mes') mes: string,
    @Query('anio') anio: string,
  ) {
    const now = new Date();
    return this.ventasService.resumenMes(
      user.id,
      mes ? parseInt(mes) : now.getMonth() + 1,
      anio ? parseInt(anio) : now.getFullYear(),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateVentaDto, @CurrentUser() user: any) {
    return this.ventasService.create(dto, user.id);
  }
}
