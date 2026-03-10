import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { CreateConsultaDto, UpdateConsultaDto } from './dto/create-consulta.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('consultas')
export class ConsultasController {
  constructor(private consultasService: ConsultasService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.consultasService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.consultasService.findOne(id, user);
  }

  @Post()
  create(@Body() dto: CreateConsultaDto, @CurrentUser() user: any) {
    return this.consultasService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateConsultaDto, @CurrentUser() user: any) {
    return this.consultasService.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.consultasService.remove(id, user);
  }
}
