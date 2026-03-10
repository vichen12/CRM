import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { LeadEstado, RolTipo } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.leadsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Post()
  @Roles(RolTipo.admin)
  create(@Body() dto: CreateLeadDto, @CurrentUser() user: any) {
    return this.leadsService.create(dto, user.id);
  }

  @Patch(':id/tomar')
  tomar(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leadsService.tomarLead(id, user.id);
  }

  @Patch(':id/estado')
  actualizarEstado(
    @Param('id') id: string,
    @Body('estado') estado: LeadEstado,
    @Body('notas') notas: string,
    @CurrentUser() user: any,
  ) {
    return this.leadsService.actualizarEstado(id, estado, user.id, notas);
  }
}
