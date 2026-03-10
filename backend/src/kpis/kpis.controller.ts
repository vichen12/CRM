import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { KpisService } from './kpis.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { RolTipo } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('kpis')
export class KpisController {
  constructor(private kpisService: KpisService) {}

  @Get('dashboard')
  dashboardVendedor(
    @CurrentUser() user: any,
    @Query('mes') mes: string,
    @Query('anio') anio: string,
  ) {
    return this.kpisService.getDashboardVendedor(
      user.id,
      mes ? parseInt(mes) : undefined,
      anio ? parseInt(anio) : undefined,
    );
  }

  @Get('admin')
  @Roles(RolTipo.admin)
  dashboardAdmin() {
    return this.kpisService.getDashboardAdmin();
  }

  @Post('recalcular')
  @Roles(RolTipo.admin)
  recalcular() {
    return this.kpisService.forzarCalculo();
  }
}
