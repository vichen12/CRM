import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { RolTipo } from '@prisma/client';

@Injectable()
export class VentasService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: { id: string; rol: RolTipo }) {
    const where = user.rol === RolTipo.admin ? {} : { vendedorId: user.id };

    return this.prisma.venta.findMany({
      where,
      include: {
        vendedor: { select: { id: true, nombre: true, apellido: true } },
        lead: { select: { id: true, nombre: true, apellido: true } },
        cliente: { select: { id: true, nombre: true, apellido: true } },
      },
      orderBy: { fechaVenta: 'desc' },
    });
  }

  async findOne(id: string) {
    const venta = await this.prisma.venta.findUnique({
      where: { id },
      include: {
        vendedor: { select: { id: true, nombre: true, apellido: true } },
        lead: true,
        cotizacion: true,
      },
    });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }

  async create(dto: CreateVentaDto, userId: string) {
    const venta = await this.prisma.venta.create({
      data: {
        ...dto,
        vendedorId: userId,
        fechaVenta: new Date(dto.fechaVenta),
        fechaVencimiento: dto.fechaVencimiento ? new Date(dto.fechaVencimiento) : undefined,
      },
    });

    // Si tiene lead asociado, cerrarlo
    if (dto.leadId) {
      await this.prisma.lead.update({
        where: { id: dto.leadId },
        data: { estado: 'cerrado' },
      });
    }

    // Actualizar stats acumuladas del vendedor
    await this.prisma.vendedorStats.upsert({
      where: { perfilId: userId },
      create: {
        perfilId: userId,
        ventasTotales: 1,
        primaTotal: venta.montoPrima ?? 0,
        comisionesTotales: venta.montoComision ?? 0,
      },
      update: {
        ventasTotales: { increment: 1 },
        primaTotal: { increment: Number(venta.montoPrima ?? 0) },
        comisionesTotales: { increment: Number(venta.montoComision ?? 0) },
      },
    });

    return venta;
  }

  async resumenMes(userId: string, mes: number, anio: number) {
    const inicio = new Date(anio, mes - 1, 1);
    const fin = new Date(anio, mes, 0);

    const ventas = await this.prisma.venta.findMany({
      where: {
        vendedorId: userId,
        fechaVenta: { gte: inicio, lte: fin },
        estado: 'vigente',
      },
    });

    const totalPrima = ventas.reduce((s, v) => s + Number(v.montoPrima ?? 0), 0);
    const totalComision = ventas.reduce((s, v) => s + Number(v.montoComision ?? 0), 0);

    return {
      cantidad: ventas.length,
      prima_total: totalPrima,
      comision_total: totalComision,
      ticket_promedio: ventas.length > 0 ? totalPrima / ventas.length : 0,
    };
  }
}
