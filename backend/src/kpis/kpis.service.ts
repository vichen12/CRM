import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { PeriodoTipo } from '@prisma/client';

@Injectable()
export class KpisService {
  private readonly logger = new Logger(KpisService.name);

  constructor(private prisma: PrismaService) {}

  // Corre todos los dias a las 2am — calcula KPIs del mes actual
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async calcularKpisMensuales() {
    this.logger.log('Calculando KPIs mensuales...');
    const ahora = new Date();
    await this.calcularPeriodo(
      PeriodoTipo.mensual,
      new Date(ahora.getFullYear(), ahora.getMonth(), 1),
      new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0),
    );
  }

  // Corre los lunes a las 2am — KPIs semanales
  @Cron('0 2 * * 1')
  async calcularKpisSemanales() {
    this.logger.log('Calculando KPIs semanales...');
    const ahora = new Date();
    const lunes = new Date(ahora);
    lunes.setDate(ahora.getDate() - ahora.getDay() + 1);
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    await this.calcularPeriodo(PeriodoTipo.semanal, lunes, domingo);
  }

  async calcularPeriodo(tipo: PeriodoTipo, inicio: Date, fin: Date) {
    const vendedores = await this.prisma.profile.findMany({
      where: { activo: true, rol: { not: 'admin' } },
      select: { id: true },
    });

    const config = await this.prisma.rankingConfig.findFirst({ where: { activa: true } });

    for (const vendedor of vendedores) {
      await this.calcularParaVendedor(vendedor.id, tipo, inicio, fin, config);
    }

    this.logger.log(`KPIs ${tipo} calculados para ${vendedores.length} vendedores`);
  }

  async calcularParaVendedor(
    perfilId: string,
    periodoTipo: PeriodoTipo,
    inicio: Date,
    fin: Date,
    config: any,
  ) {
    const [
      leadsRecibidos,
      leadsTomados,
      leadsContactados,
      reuniones,
      cotizaciones,
      ventasCerradas,
      ventasPerdidas,
      primaYComision,
    ] = await Promise.all([
      this.prisma.lead.count({ where: { zonaId: { not: null }, createdAt: { gte: inicio, lte: fin } } }),
      this.prisma.lead.count({ where: { vendedorId: perfilId, tomadoAt: { gte: inicio, lte: fin } } }),
      this.prisma.leadActividad.count({ where: { vendedorId: perfilId, tipo: 'contactado', createdAt: { gte: inicio, lte: fin } } }),
      this.prisma.leadActividad.count({ where: { vendedorId: perfilId, tipo: 'reunion_realizada', createdAt: { gte: inicio, lte: fin } } }),
      this.prisma.cotizacion.count({ where: { vendedorId: perfilId, createdAt: { gte: inicio, lte: fin } } }),
      this.prisma.venta.count({ where: { vendedorId: perfilId, estado: 'vigente', fechaVenta: { gte: inicio, lte: fin } } }),
      this.prisma.lead.count({ where: { vendedorId: perfilId, estado: 'perdido', updatedAt: { gte: inicio, lte: fin } } }),
      this.prisma.venta.aggregate({
        where: { vendedorId: perfilId, estado: 'vigente', fechaVenta: { gte: inicio, lte: fin } },
        _sum: { montoPrima: true, montoComision: true },
      }),
    ]);

    const primaTotalVendida = Number(primaYComision._sum.montoPrima ?? 0);
    const comisionGenerada = Number(primaYComision._sum.montoComision ?? 0);

    const tasaContacto = leadsTomados > 0 ? (leadsContactados / leadsTomados) * 100 : 0;
    const tasaConversion = leadsContactados > 0 ? (ventasCerradas / leadsContactados) * 100 : 0;
    const ticketPromedio = ventasCerradas > 0 ? primaTotalVendida / ventasCerradas : 0;
    const rentabilidad = leadsTomados > 0 ? comisionGenerada / leadsTomados : 0;

    // Formula de puntos configurable
    const puntos = config
      ? ventasCerradas * Number(config.pesoVentas) +
        leadsContactados * Number(config.pesoLeadsContactados) +
        tasaConversion * Number(config.pesoConversion) +
        ticketPromedio * Number(config.pesoTicketPromedio) +
        reuniones * Number(config.pesoReuniones)
      : ventasCerradas * 10 + leadsContactados * 1;

    await this.prisma.vendedorKpisPeriodo.upsert({
      where: { perfilId_periodoTipo_periodoInicio: { perfilId, periodoTipo, periodoInicio: inicio } },
      create: {
        perfilId, periodoTipo, periodoInicio: inicio, periodoFin: fin,
        leadsRecibidos, leadsTomados, leadsContactados,
        reunionesRealizadas: reuniones, cotizacionesEnviadas: cotizaciones,
        ventasCerradas, ventasPerdidas,
        primaTotalVendida, comisionGenerada,
        tasaContacto, tasaConversion, ticketPromedio, rentabilidad, puntos,
      },
      update: {
        leadsRecibidos, leadsTomados, leadsContactados,
        reunionesRealizadas: reuniones, cotizacionesEnviadas: cotizaciones,
        ventasCerradas, ventasPerdidas,
        primaTotalVendida, comisionGenerada,
        tasaContacto, tasaConversion, ticketPromedio, rentabilidad, puntos,
      },
    });
  }

  async getDashboardVendedor(perfilId: string, mes?: number, anio?: number) {
    const ahora = new Date();
    const m = mes ?? ahora.getMonth() + 1;
    const a = anio ?? ahora.getFullYear();
    const inicio = new Date(a, m - 1, 1);

    const kpis = await this.prisma.vendedorKpisPeriodo.findFirst({
      where: { perfilId, periodoTipo: PeriodoTipo.mensual, periodoInicio: inicio },
    });

    const stats = await this.prisma.vendedorStats.findUnique({ where: { perfilId } });
    const ranking = await this.prisma.rankingResultado.findFirst({
      where: { perfilId },
      include: { periodo: true },
      orderBy: { createdAt: 'desc' },
    });

    return { kpis, stats, ranking };
  }

  async getDashboardAdmin() {
    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const [totalVentas, totalLeads, topVendedores, peorRendimiento] = await Promise.all([
      this.prisma.venta.aggregate({
        where: { fechaVenta: { gte: inicio }, estado: 'vigente' },
        _sum: { montoPrima: true, montoComision: true },
        _count: true,
      }),
      this.prisma.lead.count({ where: { createdAt: { gte: inicio } } }),
      this.prisma.vendedorKpisPeriodo.findMany({
        where: { periodoTipo: PeriodoTipo.mensual, periodoInicio: inicio },
        orderBy: { puntos: 'desc' },
        take: 5,
        include: { perfil: { select: { nombre: true, apellido: true, avatarUrl: true } } },
      }),
      this.prisma.vendedorKpisPeriodo.findMany({
        where: { periodoTipo: PeriodoTipo.mensual, periodoInicio: inicio },
        orderBy: { puntos: 'asc' },
        take: 5,
        include: { perfil: { select: { nombre: true, apellido: true } } },
      }),
    ]);

    return {
      mes: { inicio },
      ventas: {
        cantidad: totalVentas._count,
        prima_total: totalVentas._sum.montoPrima,
        comision_total: totalVentas._sum.montoComision,
      },
      leads_totales: totalLeads,
      top_vendedores: topVendedores,
      peor_rendimiento: peorRendimiento,
    };
  }

  // Endpoint para forzar calculo manual (util en desarrollo)
  async forzarCalculo() {
    await this.calcularKpisMensuales();
    return { mensaje: 'KPIs recalculados' };
  }
}
