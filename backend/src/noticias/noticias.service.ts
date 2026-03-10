import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoticiasService {
  constructor(private prisma: PrismaService) {}

  findAll(soloActivas = false) {
    return this.prisma.noticia.findMany({
      where: soloActivas ? { activa: true } : undefined,
      include: { publicador: { select: { nombre: true, apellido: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async crear(data: { titulo: string; contenido: string; imagenUrl?: string }, perfilId: string) {
    const noticia = await this.prisma.noticia.create({
      data: { ...data, publicadoPor: perfilId },
    });

    // Notificar a todos los vendedores activos
    const vendedores = await this.prisma.profile.findMany({
      where: { rol: { not: 'admin' }, activo: true },
      select: { id: true },
    });

    if (vendedores.length > 0) {
      await this.prisma.notificacion.createMany({
        data: vendedores.map((v) => ({
          titulo: 'Nueva novedad publicada',
          mensaje: data.titulo,
          tipo: 'noticia' as const,
          vendedorId: v.id,
          noticiaId: noticia.id,
        })),
      });
    }

    return noticia;
  }

  async eliminar(id: string) {
    const noticia = await this.prisma.noticia.findUnique({ where: { id } });
    if (!noticia) throw new NotFoundException('Noticia no encontrada');
    await this.prisma.notificacion.deleteMany({ where: { noticiaId: id } });
    return this.prisma.noticia.delete({ where: { id } });
  }
}
