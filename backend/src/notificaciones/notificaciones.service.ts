import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificacionesService {
  constructor(private prisma: PrismaService) {}

  findAll(vendedorId: string) {
    return this.prisma.notificacion.findMany({
      where: { vendedorId },
      include: {
        lead: { select: { id: true, nombre: true, apellido: true } },
        noticia: { select: { id: true, titulo: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  marcarLeida(id: string) {
    return this.prisma.notificacion.update({
      where: { id },
      data: { leida: true },
    });
  }

  marcarTodasLeidas(vendedorId: string) {
    return this.prisma.notificacion.updateMany({
      where: { vendedorId, leida: false },
      data: { leida: true },
    });
  }
}
