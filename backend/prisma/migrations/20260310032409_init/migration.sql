-- CreateEnum
CREATE TYPE "RolTipo" AS ENUM ('admin', 'vendedor_matriculado', 'vendedor_sin_matricula');

-- CreateEnum
CREATE TYPE "LeadEstado" AS ENUM ('nuevo', 'tomado', 'contactado', 'en_proceso', 'cotizado', 'cerrado', 'perdido');

-- CreateEnum
CREATE TYPE "LeadOrigen" AS ENUM ('web', 'referido', 'manual', 'campana', 'otro');

-- CreateEnum
CREATE TYPE "LeadEventoTipo" AS ENUM ('recibido', 'tomado', 'contacto_intento', 'contactado', 'reunion_agendada', 'reunion_realizada', 'cotizacion_enviada', 'venta_cerrada', 'perdido');

-- CreateEnum
CREATE TYPE "VentaEstado" AS ENUM ('vigente', 'cancelada', 'vencida');

-- CreateEnum
CREATE TYPE "DocumentoTipo" AS ENUM ('producto', 'cobertura', 'proceso', 'formulario', 'otro');

-- CreateEnum
CREATE TYPE "NotificacionTipo" AS ENUM ('lead_nuevo', 'noticia', 'ranking', 'recompensa', 'sistema');

-- CreateEnum
CREATE TYPE "PeriodoTipo" AS ENUM ('semanal', 'mensual', 'anual');

-- CreateEnum
CREATE TYPE "RankingEstado" AS ENUM ('pendiente', 'activo', 'cerrado');

-- CreateEnum
CREATE TYPE "RecompensaTipo" AS ENUM ('dinero', 'bono', 'premio', 'reconocimiento');

-- CreateEnum
CREATE TYPE "CotizacionEstado" AS ENUM ('enviada', 'aceptada', 'rechazada', 'vencida');

-- CreateTable
CREATE TABLE "zonas" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "provincia" VARCHAR(100) NOT NULL,
    "pais" VARCHAR(100) NOT NULL DEFAULT 'Argentina',
    "descripcion" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(50),
    "rol" "RolTipo" NOT NULL DEFAULT 'vendedor_sin_matricula',
    "zona_id" TEXT,
    "matricula" VARCHAR(100),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "avatar_url" TEXT,
    "ultimo_acceso" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "telefono" VARCHAR(50) NOT NULL,
    "zona_id" TEXT,
    "estado" "LeadEstado" NOT NULL DEFAULT 'nuevo',
    "origen" "LeadOrigen" NOT NULL DEFAULT 'manual',
    "vendedor_id" TEXT,
    "notas" TEXT,
    "tomado_at" TIMESTAMP(3),
    "contactado_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_actividad" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "vendedor_id" TEXT,
    "tipo" "LeadEventoTipo" NOT NULL,
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizaciones" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "vendedor_id" TEXT NOT NULL,
    "compania" VARCHAR(100),
    "producto" VARCHAR(150) NOT NULL,
    "monto_prima" DECIMAL(12,2),
    "descripcion" TEXT,
    "estado" "CotizacionEstado" NOT NULL DEFAULT 'enviada',
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cotizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" TEXT NOT NULL,
    "vendedor_id" TEXT NOT NULL,
    "lead_id" TEXT,
    "cotizacion_id" TEXT,
    "producto" VARCHAR(150) NOT NULL,
    "compania" VARCHAR(100),
    "monto_prima" DECIMAL(12,2),
    "monto_comision" DECIMAL(12,2),
    "porcentaje_comision" DECIMAL(5,2),
    "estado" "VentaEstado" NOT NULL DEFAULT 'vigente',
    "fecha_venta" DATE NOT NULL,
    "fecha_vencimiento" DATE,
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "tipo" "DocumentoTipo" NOT NULL,
    "url" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "subido_por" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagen_url" TEXT,
    "publicado_por" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" "NotificacionTipo" NOT NULL,
    "vendedor_id" TEXT NOT NULL,
    "lead_id" TEXT,
    "noticia_id" TEXT,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendedor_kpis_periodo" (
    "id" TEXT NOT NULL,
    "perfil_id" TEXT NOT NULL,
    "periodo_tipo" "PeriodoTipo" NOT NULL,
    "periodo_inicio" DATE NOT NULL,
    "periodo_fin" DATE NOT NULL,
    "leads_recibidos" INTEGER NOT NULL DEFAULT 0,
    "leads_tomados" INTEGER NOT NULL DEFAULT 0,
    "leads_contactados" INTEGER NOT NULL DEFAULT 0,
    "reuniones_realizadas" INTEGER NOT NULL DEFAULT 0,
    "cotizaciones_enviadas" INTEGER NOT NULL DEFAULT 0,
    "ventas_cerradas" INTEGER NOT NULL DEFAULT 0,
    "ventas_perdidas" INTEGER NOT NULL DEFAULT 0,
    "prima_total_vendida" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "comision_generada" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "comision_pagada" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tasa_contacto" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "tasa_conversion" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "ticket_promedio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "rentabilidad" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "puntos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "posicion_ranking" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendedor_kpis_periodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendedor_stats" (
    "perfil_id" TEXT NOT NULL,
    "leads_totales" INTEGER NOT NULL DEFAULT 0,
    "leads_contactados" INTEGER NOT NULL DEFAULT 0,
    "reuniones_totales" INTEGER NOT NULL DEFAULT 0,
    "cotizaciones_totales" INTEGER NOT NULL DEFAULT 0,
    "ventas_totales" INTEGER NOT NULL DEFAULT 0,
    "ventas_perdidas" INTEGER NOT NULL DEFAULT 0,
    "prima_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "comisiones_totales" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tasa_conversion_total" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "ticket_promedio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendedor_stats_pkey" PRIMARY KEY ("perfil_id")
);

-- CreateTable
CREATE TABLE "ranking_config" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL DEFAULT 'default',
    "peso_ventas" DECIMAL(6,2) NOT NULL DEFAULT 10,
    "peso_leads_contactados" DECIMAL(6,2) NOT NULL DEFAULT 1,
    "peso_conversion" DECIMAL(6,2) NOT NULL DEFAULT 5,
    "peso_ticket_promedio" DECIMAL(6,3) NOT NULL DEFAULT 0.001,
    "peso_reuniones" DECIMAL(6,2) NOT NULL DEFAULT 2,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ranking_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranking_periodos" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "estado" "RankingEstado" NOT NULL DEFAULT 'pendiente',
    "ranking_config_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ranking_periodos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranking_resultados" (
    "id" TEXT NOT NULL,
    "ranking_periodo_id" TEXT NOT NULL,
    "perfil_id" TEXT NOT NULL,
    "puntos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "posicion" INTEGER,
    "ventas" INTEGER NOT NULL DEFAULT 0,
    "leads_contactados" INTEGER NOT NULL DEFAULT 0,
    "tasa_conversion" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "comision_generada" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "prima_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ranking_resultados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recompensas" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "tipo" "RecompensaTipo" NOT NULL,
    "valor" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recompensas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recompensas_otorgadas" (
    "id" TEXT NOT NULL,
    "perfil_id" TEXT NOT NULL,
    "ranking_periodo_id" TEXT,
    "recompensa_id" TEXT NOT NULL,
    "posicion" INTEGER,
    "pagada" BOOLEAN NOT NULL DEFAULT false,
    "fecha_pago" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recompensas_otorgadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "perfil_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revocado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "leads_vendedor_id_idx" ON "leads"("vendedor_id");

-- CreateIndex
CREATE INDEX "leads_zona_id_idx" ON "leads"("zona_id");

-- CreateIndex
CREATE INDEX "leads_estado_idx" ON "leads"("estado");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at" DESC);

-- CreateIndex
CREATE INDEX "lead_actividad_lead_id_idx" ON "lead_actividad"("lead_id");

-- CreateIndex
CREATE INDEX "lead_actividad_tipo_idx" ON "lead_actividad"("tipo");

-- CreateIndex
CREATE INDEX "cotizaciones_lead_id_idx" ON "cotizaciones"("lead_id");

-- CreateIndex
CREATE INDEX "cotizaciones_vendedor_id_idx" ON "cotizaciones"("vendedor_id");

-- CreateIndex
CREATE INDEX "ventas_vendedor_id_idx" ON "ventas"("vendedor_id");

-- CreateIndex
CREATE INDEX "ventas_fecha_venta_idx" ON "ventas"("fecha_venta" DESC);

-- CreateIndex
CREATE INDEX "ventas_estado_idx" ON "ventas"("estado");

-- CreateIndex
CREATE INDEX "notificaciones_vendedor_id_leida_idx" ON "notificaciones"("vendedor_id", "leida");

-- CreateIndex
CREATE INDEX "notificaciones_created_at_idx" ON "notificaciones"("created_at" DESC);

-- CreateIndex
CREATE INDEX "vendedor_kpis_periodo_perfil_id_idx" ON "vendedor_kpis_periodo"("perfil_id");

-- CreateIndex
CREATE INDEX "vendedor_kpis_periodo_periodo_inicio_idx" ON "vendedor_kpis_periodo"("periodo_inicio" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "vendedor_kpis_periodo_perfil_id_periodo_tipo_periodo_inicio_key" ON "vendedor_kpis_periodo"("perfil_id", "periodo_tipo", "periodo_inicio");

-- CreateIndex
CREATE INDEX "ranking_resultados_ranking_periodo_id_idx" ON "ranking_resultados"("ranking_periodo_id");

-- CreateIndex
CREATE INDEX "ranking_resultados_posicion_idx" ON "ranking_resultados"("posicion");

-- CreateIndex
CREATE UNIQUE INDEX "ranking_resultados_ranking_periodo_id_perfil_id_key" ON "ranking_resultados"("ranking_periodo_id", "perfil_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_perfil_id_idx" ON "refresh_tokens"("perfil_id");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_zona_id_fkey" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_zona_id_fkey" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_actividad" ADD CONSTRAINT "lead_actividad_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_actividad" ADD CONSTRAINT "lead_actividad_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_subido_por_fkey" FOREIGN KEY ("subido_por") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_publicado_por_fkey" FOREIGN KEY ("publicado_por") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_noticia_id_fkey" FOREIGN KEY ("noticia_id") REFERENCES "noticias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendedor_kpis_periodo" ADD CONSTRAINT "vendedor_kpis_periodo_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendedor_stats" ADD CONSTRAINT "vendedor_stats_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ranking_periodos" ADD CONSTRAINT "ranking_periodos_ranking_config_id_fkey" FOREIGN KEY ("ranking_config_id") REFERENCES "ranking_config"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ranking_resultados" ADD CONSTRAINT "ranking_resultados_ranking_periodo_id_fkey" FOREIGN KEY ("ranking_periodo_id") REFERENCES "ranking_periodos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ranking_resultados" ADD CONSTRAINT "ranking_resultados_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recompensas_otorgadas" ADD CONSTRAINT "recompensas_otorgadas_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recompensas_otorgadas" ADD CONSTRAINT "recompensas_otorgadas_ranking_periodo_id_fkey" FOREIGN KEY ("ranking_periodo_id") REFERENCES "ranking_periodos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recompensas_otorgadas" ADD CONSTRAINT "recompensas_otorgadas_recompensa_id_fkey" FOREIGN KEY ("recompensa_id") REFERENCES "recompensas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
