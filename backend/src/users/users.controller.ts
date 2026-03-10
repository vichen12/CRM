import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { RolTipo } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.usersService.getMe(user.id);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: any,
    @Body() body: { nombre?: string; apellido?: string; telefono?: string; avatar_url?: string },
  ) {
    return this.usersService.updateMe(user.id, body);
  }

  @Post('me/change-password')
  changePassword(
    @CurrentUser() user: any,
    @Body() body: { current_password: string; new_password: string },
  ) {
    return this.usersService.changePassword(user.id, body.current_password, body.new_password);
  }

  @Get('vendedores')
  getVendedores() {
    return this.usersService.getVendedores();
  }

  @Post()
  @Roles(RolTipo.admin)
  crear(@Body() body: any) {
    const { zona_id, ...rest } = body;
    return this.usersService.crear({ ...rest, zonaId: zona_id });
  }

  @Patch(':id')
  @Roles(RolTipo.admin)
  actualizar(@Param('id') id: string, @Body() body: any) {
    return this.usersService.actualizar(id, body);
  }
}
