import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KpisService } from '../kpis/kpis.service';
import { PeriodoTipo, RankingEstado } from '@prisma/client';

@Injectable()
export class RankingService {
  constructor(
    private prisma: PrismaService,
    private kpisService: KpisService,
  ) {}

  async getPeriodos() {
    return this.prisma.rankingPeriodo.findMany({
      include: { config: true },
      orderBy: { fechaInicio: 'desc' },
    });
  }

  async getPeriodoActivo() {
    return this.prisma.rankingPeriodo.findFirst({
      where: { estado: RankingEstado.activo },
      include: {
        resultados: {
          orderBy: { posicion: 'asc' },
          include: {
            perfil: { select: { id: true, nombre: true, apellido: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  async getRanking(periodoId: string) {
    return this.prisma.rankingResultado.findMany({
      where: { rankingPeriodoId: periodoId },
      orderBy: { posicion: 'asc' },
      include: {
        perfil: { select: { id: true, nombre: true, apellido: true, avatarUrl: true, zona: true } },
      },
    });
  }

  async crearPeriodo(data: {
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
    rankingConfigId?: string;
  }) {
    return this.prisma.rankingPeriodo.create({
      data: {
        nombre: data.nombre,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin: new Date(data.fechaFin),
        rankingConfigId: data.rankingConfigId,
        estado: RankingEstado.pendiente,
      },
    });
  }

  async cerrarPeriodo(periodoId: string) {
    const periodo = await this.prisma.rankingPeriodo.findUnique({ where: { id: periodoId } });
    if (!periodo) throw new NotFoundException('Periodo no encontrado');
    if (periodo.estado === RankingEstado.cerrado) throw new BadRequestException('Ya esta cerrado');

    const config = periodo.rankingConfigId
      ? await this.prisma.rankingConfig.findUnique({ where: { id: periodo.rankingConfigId } })
      : await this.prisma.rankingConfig.findFirst({ where: { activa: true } });

    // Calcular KPIs finales para el periodo
    await this.kpisService.calcularPeriodo(
      PeriodoTipo.mensual,
      periodo.fechaInicio,
      periodo.fechaFin,
    );

    // Obtener KPIs del periodo
    const kpis = await this.prisma.vendedorKpisPeriodo.findMany({
      where: {
        periodoTipo: PeriodoTipo.mensual,
        periodoInicio: periodo.fechaInicio,
      },
      orderBy: { puntos: 'desc' },
    });

    // Guardar resultados con posicion
    await this.prisma.$transaction(
      kpis.map((kpi, index) =>
        this.prisma.rankingResultado.upsert({
          where: { rankingPeriodoId_perfilId: { rankingPeriodoId: periodoId, perfilId: kpi.perfilId } },
          create: {
            rankingPeriodoId: periodoId,
            perfilId: kpi.perfilId,
            puntos: kpi.puntos,
            posicion: index + 1,
            ventas: kpi.ventasCerradas,
            leadsContactados: kpi.leadsContactados,
            tasaConversion: kpi.tasaConversion,
            comisionGenerada: kpi.comisionGenerada,
            primaTotal: kpi.primaTotalVendida,
          },
          update: {
            puntos: kpi.puntos,
            posicion: index + 1,
            ventas: kpi.ventasCerradas,
            leadsContactados: kpi.leadsContactados,
            tasaConversion: kpi.tasaConversion,
            comisionGenerada: kpi.comisionGenerada,
            primaTotal: kpi.primaTotalVendida,
          },
        }),
      ),
    );

    await this.prisma.rankingPeriodo.update({
      where: { id: periodoId },
      data: { estado: RankingEstado.cerrado },
    });

    return { mensaje: 'Periodo cerrado y ranking guardado', total_vendedores: kpis.length };
  }

  async getConfig() {
    return this.prisma.rankingConfig.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async actualizarConfig(id: string, data: Partial<{
    pesoVentas: number;
    pesoLeadsContactados: number;
    pesoConversion: number;
    pesoTicketPromedio: number;
    pesoReuniones: number;
  }>) {
    return this.prisma.rankingConfig.update({ where: { id }, data });
  }
}
