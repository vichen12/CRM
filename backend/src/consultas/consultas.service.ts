import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsultaDto, UpdateConsultaDto } from './dto/create-consulta.dto';
import { RolTipo } from '@prisma/client';

@Injectable()
export class ConsultasService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: { id: string; rol: RolTipo }) {
    const where = user.rol === RolTipo.admin ? {} : { vendedorId: user.id };
    return this.prisma.consulta.findMany({
      where,
      include: {
        vendedor: { select: { id: true, nombre: true, apellido: true } },
        cliente: { select: { id: true, nombre: true, apellido: true } },
        lead: { select: { id: true, nombre: true, apellido: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: { id: string; rol: RolTipo }) {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id },
      include: {
        vendedor: { select: { id: true, nombre: true, apellido: true } },
        cliente: true,
        lead: true,
      },
    });
    if (!consulta) throw new NotFoundException('Consulta no encontrada');
    if (user.rol !== RolTipo.admin && consulta.vendedorId !== user.id) {
      throw new ForbiddenException();
    }
    return consulta;
  }

  async create(dto: CreateConsultaDto, userId: string) {
    return this.prisma.consulta.create({
      data: {
        ...dto,
        vendedorId: userId,
      },
      include: {
        cliente: { select: { id: true, nombre: true, apellido: true } },
        lead: { select: { id: true, nombre: true, apellido: true } },
      },
    });
  }

  async update(id: string, dto: UpdateConsultaDto, user: { id: string; rol: RolTipo }) {
    const consulta = await this.prisma.consulta.findUnique({ where: { id } });
    if (!consulta) throw new NotFoundException('Consulta no encontrada');
    if (user.rol !== RolTipo.admin && consulta.vendedorId !== user.id) {
      throw new ForbiddenException();
    }
    return this.prisma.consulta.update({ where: { id }, data: dto });
  }

  async remove(id: string, user: { id: string; rol: RolTipo }) {
    const consulta = await this.prisma.consulta.findUnique({ where: { id } });
    if (!consulta) throw new NotFoundException('Consulta no encontrada');
    if (user.rol !== RolTipo.admin && consulta.vendedorId !== user.id) {
      throw new ForbiddenException();
    }
    return this.prisma.consulta.delete({ where: { id } });
  }
}
