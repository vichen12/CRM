import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZonasService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.zona.findMany({
      where: { activa: true },
      orderBy: { nombre: 'asc' },
    });
  }

  crear(data: { nombre: string; provincia: string; pais?: string; descripcion?: string }) {
    return this.prisma.zona.create({ data });
  }
}
