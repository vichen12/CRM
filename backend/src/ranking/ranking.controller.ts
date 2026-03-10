import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolTipo } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ranking')
export class RankingController {
  constructor(private rankingService: RankingService) {}

  @Get('activo')
  getPeriodoActivo() {
    return this.rankingService.getPeriodoActivo();
  }

  @Get('periodos')
  getPeriodos() {
    return this.rankingService.getPeriodos();
  }

  @Get('periodos/:id')
  getRanking(@Param('id') id: string) {
    return this.rankingService.getRanking(id);
  }

  @Post('periodos')
  @Roles(RolTipo.admin)
  crearPeriodo(@Body() body: any) {
    return this.rankingService.crearPeriodo(body);
  }

  @Post('periodos/:id/cerrar')
  @Roles(RolTipo.admin)
  cerrarPeriodo(@Param('id') id: string) {
    return this.rankingService.cerrarPeriodo(id);
  }

  @Get('config')
  @Roles(RolTipo.admin)
  getConfig() {
    return this.rankingService.getConfig();
  }

  @Patch('config/:id')
  @Roles(RolTipo.admin)
  actualizarConfig(@Param('id') id: string, @Body() body: any) {
    return this.rankingService.actualizarConfig(id, body);
  }
}
