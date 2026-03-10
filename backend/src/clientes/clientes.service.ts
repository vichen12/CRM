import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { RolTipo } from '@prisma/client';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: { id: string; rol: RolTipo }) {
    const where = user.rol === RolTipo.admin ? {} : { vendedorId: user.id };
    return this.prisma.cliente.findMany({
      where,
      include: {
        vendedor: { select: { id: true, nombre: true, apellido: true } },
        _count: { select: { ventas: true, consultas: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: { id: string; rol: RolTipo }) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        vendedor: { select: { id: true, nombre: true, apellido: true } },
        ventas: { orderBy: { fechaVenta: 'desc' } },
        consultas: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    if (user.rol !== RolTipo.admin && cliente.vendedorId !== user.id) {
      throw new ForbiddenException();
    }
    return cliente;
  }

  async create(dto: CreateClienteDto, userId: string) {
    return this.prisma.cliente.create({
      data: {
        ...dto,
        vendedorId: userId,
        fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : undefined,
      },
    });
  }

  async update(id: string, dto: Partial<CreateClienteDto>, user: { id: string; rol: RolTipo }) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    if (user.rol !== RolTipo.admin && cliente.vendedorId !== user.id) {
      throw new ForbiddenException();
    }
    return this.prisma.cliente.update({
      where: { id },
      data: {
        ...dto,
        fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : undefined,
      },
    });
  }

  async remove(id: string, user: { id: string; rol: RolTipo }) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    if (user.rol !== RolTipo.admin && cliente.vendedorId !== user.id) {
      throw new ForbiddenException();
    }
    return this.prisma.cliente.update({ where: { id }, data: { activo: false } });
  }
}
