import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentoTipo } from '@prisma/client';

@Injectable()
export class DocumentosService {
  constructor(private prisma: PrismaService) {}

  findAll(tipo?: DocumentoTipo) {
    return this.prisma.documento.findMany({
      where: tipo ? { tipo } : undefined,
      include: { subidor: { select: { nombre: true, apellido: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  crear(
    data: { nombre: string; descripcion?: string; tipo: DocumentoTipo; url: string },
    perfilId: string,
  ) {
    return this.prisma.documento.create({
      data: { ...data, storagePath: data.url, subidoPor: perfilId },
    });
  }

  async eliminar(id: string) {
    const doc = await this.prisma.documento.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Documento no encontrado');
    return this.prisma.documento.delete({ where: { id } });
  }
}
