import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private notificacionesService: NotificacionesService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.notificacionesService.findAll(user.id);
  }

  @Patch(':id/leer')
  marcarLeida(@Param('id') id: string) {
    return this.notificacionesService.marcarLeida(id);
  }

  @Patch('leer-todas')
  marcarTodasLeidas(@CurrentUser() user: any) {
    return this.notificacionesService.marcarTodasLeidas(user.id);
  }
}
