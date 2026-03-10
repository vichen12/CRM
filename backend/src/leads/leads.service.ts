import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { RolTipo, LeadEstado } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: { id: string; rol: RolTipo }) {
    // Admin ve todos, vendedor solo los de su zona o asignados
    if (user.rol === RolTipo.admin) {
      return this.prisma.lead.findMany({
        include: { zona: true, vendedor: { select: { id: true, nombre: true, apellido: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }

    const profile = await this.prisma.profile.findUnique({ where: { id: user.id } });

    return this.prisma.lead.findMany({
      where: {
        OR: [
          { vendedorId: user.id },
          { zonaId: profile?.zonaId ?? undefined, estado: LeadEstado.nuevo },
        ],
      },
      include: { zona: true, vendedor: { select: { id: true, nombre: true, apellido: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        zona: true,
        vendedor: { select: { id: true, nombre: true, apellido: true } },
        actividades: { orderBy: { createdAt: 'desc' } },
        cotizaciones: true,
        ventas: true,
      },
    });
    if (!lead) throw new NotFoundException('Lead no encontrado');
    return lead;
  }

  async create(dto: CreateLeadDto, userId: string) {
    const lead = await this.prisma.lead.create({
      data: { ...dto, estado: LeadEstado.nuevo },
    });

    await this.prisma.leadActividad.create({
      data: { leadId: lead.id, vendedorId: userId, tipo: 'recibido' },
    });

    // Notificar a vendedores de la zona
    if (lead.zonaId) {
      const vendedoresZona = await this.prisma.profile.findMany({
        where: { zonaId: lead.zonaId, activo: true, rol: { not: RolTipo.admin } },
        select: { id: true },
      });

      await this.prisma.notificacion.createMany({
        data: vendedoresZona.map((v) => ({
          titulo: 'Nuevo lead disponible',
          mensaje: `${lead.nombre} ${lead.apellido} - ${lead.telefono}`,
          tipo: 'lead_nuevo' as const,
          vendedorId: v.id,
          leadId: lead.id,
        })),
      });
    }

    return lead;
  }

  async tomarLead(id: string, userId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead no encontrado');
    if (lead.estado !== LeadEstado.nuevo) throw new ForbiddenException('Lead ya fue tomado');

    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        vendedorId: userId,
        estado: LeadEstado.tomado,
        tomadoAt: new Date(),
      },
    });

    await this.prisma.leadActividad.create({
      data: { leadId: id, vendedorId: userId, tipo: 'tomado' },
    });

    return updated;
  }

  async actualizarEstado(
    id: string,
    estado: LeadEstado,
    userId: string,
    notas?: string,
  ) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead no encontrado');
    if (lead.vendedorId !== userId) throw new ForbiddenException('No es tu lead');

    const data: Record<string, unknown> = { estado };
    if (estado === LeadEstado.contactado) data.contactadoAt = new Date();

    const updated = await this.prisma.lead.update({ where: { id }, data });

    // Mapear estado a tipo de evento
    const eventoMap: Partial<Record<LeadEstado, string>> = {
      contactado: 'contactado',
      en_proceso: 'cotizacion_enviada',
      cerrado: 'venta_cerrada',
      perdido: 'perdido',
    };

    const tipo = eventoMap[estado];
    if (tipo) {
      await this.prisma.leadActividad.create({
        data: { leadId: id, vendedorId: userId, tipo: tipo as any, notas },
      });
    }

    return updated;
  }
}
