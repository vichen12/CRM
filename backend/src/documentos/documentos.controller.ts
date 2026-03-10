import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { DocumentoTipo, RolTipo } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documentos')
export class DocumentosController {
  constructor(private documentosService: DocumentosService) {}

  @Get()
  findAll(@Query('tipo') tipo: DocumentoTipo) {
    return this.documentosService.findAll(tipo);
  }

  @Post()
  @Roles(RolTipo.admin)
  crear(@Body() body: any, @CurrentUser() user: any) {
    return this.documentosService.crear(body, user.id);
  }

  @Delete(':id')
  @Roles(RolTipo.admin)
  eliminar(@Param('id') id: string) {
    return this.documentosService.eliminar(id);
  }
}
