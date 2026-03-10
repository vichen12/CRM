-- ============================================================
-- BROKER SEGUROS CRM - Schema completo
-- PostgreSQL (Railway)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE rol_tipo          AS ENUM ('admin', 'vendedor_matriculado', 'vendedor_sin_matricula');
CREATE TYPE lead_estado       AS ENUM ('nuevo', 'tomado', 'contactado', 'en_proceso', 'cotizado', 'cerrado', 'perdido');
CREATE TYPE lead_origen       AS ENUM ('web', 'referido', 'manual', 'campana', 'otro');
CREATE TYPE lead_evento_tipo  AS ENUM ('recibido', 'tomado', 'contacto_intento', 'contactado', 'reunion_agendada', 'reunion_realizada', 'cotizacion_enviada', 'venta_cerrada', 'perdido');
CREATE TYPE venta_estado      AS ENUM ('vigente', 'cancelada', 'vencida');
CREATE TYPE documento_tipo    AS ENUM ('producto', 'cobertura', 'proceso', 'formulario', 'otro');
CREATE TYPE notificacion_tipo AS ENUM ('lead_nuevo', 'noticia', 'ranking', 'recompensa', 'sistema');
CREATE TYPE periodo_tipo      AS ENUM ('semanal', 'mensual', 'anual');
CREATE TYPE ranking_estado    AS ENUM ('pendiente', 'activo', 'cerrado');
CREATE TYPE recompensa_tipo   AS ENUM ('dinero', 'bono', 'premio', 'reconocimiento');
CREATE TYPE cotizacion_estado AS ENUM ('enviada', 'aceptada', 'rechazada', 'vencida');

-- ============================================================
-- ZONAS
-- ============================================================

CREATE TABLE zonas (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      VARCHAR(100) NOT NULL,
  provincia   VARCHAR(100) NOT NULL,
  pais        VARCHAR(100) NOT NULL DEFAULT 'Argentina',
  descripcion TEXT,
  activa      BOOLEAN     DEFAULT true,
  created_at  TIMESTAMP   DEFAULT NOW()
);

-- ============================================================
-- PROFILES (usuarios del sistema)
-- ============================================================

CREATE TABLE profiles (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre        VARCHAR(100) NOT NULL,
  apellido      VARCHAR(100) NOT NULL,
  telefono      VARCHAR(50),
  rol           rol_tipo    NOT NULL DEFAULT 'vendedor_sin_matricula',
  zona_id       UUID        REFERENCES zonas(id) ON DELETE SET NULL,
  matricula     VARCHAR(100),
  activo        BOOLEAN     DEFAULT true,
  avatar_url    TEXT,
  ultimo_acceso TIMESTAMP,
  created_at    TIMESTAMP   DEFAULT NOW(),
  updated_at    TIMESTAMP   DEFAULT NOW()
);

-- ============================================================
-- LEADS
-- ============================================================

CREATE TABLE leads (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre        VARCHAR(100) NOT NULL,
  apellido      VARCHAR(100) NOT NULL,
  email         VARCHAR(255),
  telefono      VARCHAR(50)  NOT NULL,
  zona_id       UUID        REFERENCES zonas(id) ON DELETE SET NULL,
  estado        lead_estado DEFAULT 'nuevo',
  origen        lead_origen DEFAULT 'manual',
  vendedor_id   UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  notas         TEXT,
  tomado_at     TIMESTAMP,
  contactado_at TIMESTAMP,
  created_at    TIMESTAMP   DEFAULT NOW(),
  updated_at    TIMESTAMP   DEFAULT NOW()
);

-- ============================================================
-- LEAD ACTIVIDAD (embudo / funnel tracking)
-- leads → contacto → cotización → venta
-- ============================================================

CREATE TABLE lead_actividad (
  id          UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID             NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  vendedor_id UUID             REFERENCES profiles(id) ON DELETE SET NULL,
  tipo        lead_evento_tipo NOT NULL,
  notas       TEXT,
  created_at  TIMESTAMP        DEFAULT NOW()
);

-- ============================================================
-- COTIZACIONES
-- ============================================================

CREATE TABLE cotizaciones (
  id          UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID              NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  vendedor_id UUID              NOT NULL REFERENCES profiles(id),
  compania    VARCHAR(100),
  producto    VARCHAR(150)      NOT NULL,
  monto_prima DECIMAL(12,2),
  descripcion TEXT,
  estado      cotizacion_estado DEFAULT 'enviada',
  fecha_envio TIMESTAMP         DEFAULT NOW(),
  created_at  TIMESTAMP         DEFAULT NOW()
);

-- ============================================================
-- VENTAS
-- ============================================================

CREATE TABLE ventas (
  id                   UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendedor_id          UUID         NOT NULL REFERENCES profiles(id),
  lead_id              UUID         REFERENCES leads(id) ON DELETE SET NULL,
  cotizacion_id        UUID         REFERENCES cotizaciones(id) ON DELETE SET NULL,
  producto             VARCHAR(150) NOT NULL,
  compania             VARCHAR(100),
  monto_prima          DECIMAL(12,2),
  monto_comision       DECIMAL(12,2),
  porcentaje_comision  DECIMAL(5,2),
  estado               venta_estado DEFAULT 'vigente',
  fecha_venta          DATE         NOT NULL,
  fecha_vencimiento    DATE,
  notas                TEXT,
  created_at           TIMESTAMP    DEFAULT NOW(),
  updated_at           TIMESTAMP    DEFAULT NOW()
);

-- ============================================================
-- DOCUMENTOS
-- ============================================================

CREATE TABLE documentos (
  id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre       VARCHAR(200)   NOT NULL,
  descripcion  TEXT,
  tipo         documento_tipo NOT NULL,
  url          TEXT           NOT NULL,
  storage_path TEXT           NOT NULL,
  subido_por   UUID           NOT NULL REFERENCES profiles(id),
  created_at   TIMESTAMP      DEFAULT NOW()
);

-- ============================================================
-- NOTICIAS
-- ============================================================

CREATE TABLE noticias (
  id            UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo        VARCHAR(200) NOT NULL,
  contenido     TEXT         NOT NULL,
  imagen_url    TEXT,
  publicado_por UUID         NOT NULL REFERENCES profiles(id),
  activa        BOOLEAN      DEFAULT true,
  created_at    TIMESTAMP    DEFAULT NOW(),
  updated_at    TIMESTAMP    DEFAULT NOW()
);

-- ============================================================
-- NOTIFICACIONES
-- ============================================================

CREATE TABLE notificaciones (
  id         UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo     VARCHAR(200)      NOT NULL,
  mensaje    TEXT              NOT NULL,
  tipo       notificacion_tipo NOT NULL,
  vendedor_id UUID             NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id    UUID              REFERENCES leads(id) ON DELETE SET NULL,
  noticia_id UUID              REFERENCES noticias(id) ON DELETE SET NULL,
  leida      BOOLEAN           DEFAULT false,
  created_at TIMESTAMP         DEFAULT NOW()
);

-- ============================================================
-- KPIs POR PERIODO
-- Se calcula y guarda periodicamente (cron job)
-- Permite dashboards rapidos sin queries pesadas en vivo
-- ============================================================

CREATE TABLE vendedor_kpis_periodo (
  id                   UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  perfil_id            UUID         NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  periodo_tipo         periodo_tipo NOT NULL,
  periodo_inicio       DATE         NOT NULL,
  periodo_fin          DATE         NOT NULL,

  -- actividad
  leads_recibidos      INTEGER      DEFAULT 0,
  leads_tomados        INTEGER      DEFAULT 0,
  leads_contactados    INTEGER      DEFAULT 0,
  reuniones_realizadas INTEGER      DEFAULT 0,
  cotizaciones_enviadas INTEGER     DEFAULT 0,

  -- ventas
  ventas_cerradas      INTEGER      DEFAULT 0,
  ventas_perdidas      INTEGER      DEFAULT 0,

  -- dinero
  prima_total_vendida  DECIMAL(14,2) DEFAULT 0,
  comision_generada    DECIMAL(14,2) DEFAULT 0,
  comision_pagada      DECIMAL(14,2) DEFAULT 0,

  -- rendimiento (calculado al guardar)
  tasa_contacto        DECIMAL(5,2) DEFAULT 0,   -- leads_contactados / leads_tomados * 100
  tasa_conversion      DECIMAL(5,2) DEFAULT 0,   -- ventas_cerradas / leads_contactados * 100
  ticket_promedio      DECIMAL(12,2) DEFAULT 0,  -- prima_total / ventas_cerradas
  rentabilidad         DECIMAL(12,2) DEFAULT 0,  -- comision_generada / leads_tomados

  -- ranking
  puntos               DECIMAL(10,2) DEFAULT 0,
  posicion_ranking     INTEGER,

  created_at           TIMESTAMP    DEFAULT NOW(),

  UNIQUE (perfil_id, periodo_tipo, periodo_inicio)
);

-- ============================================================
-- STATS ACUMULADAS (historico total del vendedor)
-- Se actualiza con triggers o cron
-- ============================================================

CREATE TABLE vendedor_stats (
  perfil_id              UUID         PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,

  -- actividad total
  leads_totales          INTEGER      DEFAULT 0,
  leads_contactados      INTEGER      DEFAULT 0,
  reuniones_totales      INTEGER      DEFAULT 0,
  cotizaciones_totales   INTEGER      DEFAULT 0,

  -- ventas
  ventas_totales         INTEGER      DEFAULT 0,
  ventas_perdidas        INTEGER      DEFAULT 0,

  -- dinero
  prima_total            DECIMAL(14,2) DEFAULT 0,
  comisiones_totales     DECIMAL(14,2) DEFAULT 0,

  -- rendimiento
  tasa_conversion_total  DECIMAL(5,2) DEFAULT 0,
  ticket_promedio        DECIMAL(12,2) DEFAULT 0,

  updated_at             TIMESTAMP    DEFAULT NOW()
);

-- ============================================================
-- RANKING CONFIG (formula de puntos — configurable por admin)
-- ============================================================

CREATE TABLE ranking_config (
  id                    UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre                VARCHAR(100)  NOT NULL DEFAULT 'default',
  peso_ventas           DECIMAL(6,2)  DEFAULT 10,    -- puntos por venta cerrada
  peso_leads_contactados DECIMAL(6,2) DEFAULT 1,     -- puntos por lead contactado
  peso_conversion       DECIMAL(6,2)  DEFAULT 5,     -- multiplicador tasa conversion
  peso_ticket_promedio  DECIMAL(6,2)  DEFAULT 0.001, -- puntos por peso de prima
  peso_reuniones        DECIMAL(6,2)  DEFAULT 2,     -- puntos por reunion
  activa                BOOLEAN       DEFAULT true,
  created_at            TIMESTAMP     DEFAULT NOW()
);

-- ============================================================
-- RANKING PERIODOS (cada competencia/mes)
-- ============================================================

CREATE TABLE ranking_periodos (
  id                UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre            VARCHAR(150)    NOT NULL,
  fecha_inicio      DATE            NOT NULL,
  fecha_fin         DATE            NOT NULL,
  estado            ranking_estado  DEFAULT 'pendiente',
  ranking_config_id UUID            REFERENCES ranking_config(id),
  created_at        TIMESTAMP       DEFAULT NOW()
);

-- ============================================================
-- RANKING RESULTADOS (snapshot al cierre del periodo)
-- ============================================================

CREATE TABLE ranking_resultados (
  id                   UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
  ranking_periodo_id   UUID      NOT NULL REFERENCES ranking_periodos(id) ON DELETE CASCADE,
  perfil_id            UUID      NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  puntos               DECIMAL(10,2) DEFAULT 0,
  posicion             INTEGER,

  -- snapshot de metricas al cierre
  ventas               INTEGER   DEFAULT 0,
  leads_contactados    INTEGER   DEFAULT 0,
  tasa_conversion      DECIMAL(5,2) DEFAULT 0,
  comision_generada    DECIMAL(14,2) DEFAULT 0,
  prima_total          DECIMAL(14,2) DEFAULT 0,

  created_at           TIMESTAMP DEFAULT NOW(),

  UNIQUE (ranking_periodo_id, perfil_id)
);

-- ============================================================
-- RECOMPENSAS (definicion de premios)
-- ============================================================

CREATE TABLE recompensas (
  id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      VARCHAR(150)    NOT NULL,
  descripcion TEXT,
  tipo        recompensa_tipo NOT NULL,
  valor       DECIMAL(12,2),
  created_at  TIMESTAMP       DEFAULT NOW()
);

-- ============================================================
-- RECOMPENSAS OTORGADAS
-- ============================================================

CREATE TABLE recompensas_otorgadas (
  id                 UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
  perfil_id          UUID      NOT NULL REFERENCES profiles(id),
  ranking_periodo_id UUID      REFERENCES ranking_periodos(id),
  recompensa_id      UUID      NOT NULL REFERENCES recompensas(id),
  posicion           INTEGER,
  pagada             BOOLEAN   DEFAULT false,
  fecha_pago         TIMESTAMP,
  created_at         TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- REFRESH TOKENS (auth JWT)
-- ============================================================

CREATE TABLE refresh_tokens (
  id         UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
  perfil_id  UUID      NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token      TEXT      NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  revocado   BOOLEAN   DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES (performance critica con 5000+ usuarios)
-- ============================================================

-- leads
CREATE INDEX idx_leads_vendedor   ON leads(vendedor_id);
CREATE INDEX idx_leads_zona       ON leads(zona_id);
CREATE INDEX idx_leads_estado     ON leads(estado);
CREATE INDEX idx_leads_created    ON leads(created_at DESC);

-- ventas
CREATE INDEX idx_ventas_vendedor  ON ventas(vendedor_id);
CREATE INDEX idx_ventas_fecha     ON ventas(fecha_venta DESC);
CREATE INDEX idx_ventas_estado    ON ventas(estado);

-- kpis
CREATE INDEX idx_kpis_perfil      ON vendedor_kpis_periodo(perfil_id);
CREATE INDEX idx_kpis_periodo     ON vendedor_kpis_periodo(periodo_inicio DESC);
CREATE INDEX idx_kpis_tipo        ON vendedor_kpis_periodo(periodo_tipo);

-- ranking
CREATE INDEX idx_ranking_periodo  ON ranking_resultados(ranking_periodo_id);
CREATE INDEX idx_ranking_perfil   ON ranking_resultados(perfil_id);
CREATE INDEX idx_ranking_posicion ON ranking_resultados(posicion);

-- notificaciones
CREATE INDEX idx_notif_vendedor   ON notificaciones(vendedor_id, leida);
CREATE INDEX idx_notif_created    ON notificaciones(created_at DESC);

-- actividad del lead
CREATE INDEX idx_actividad_lead   ON lead_actividad(lead_id);
CREATE INDEX idx_actividad_tipo   ON lead_actividad(tipo);

-- cotizaciones
CREATE INDEX idx_cotiz_lead       ON cotizaciones(lead_id);
CREATE INDEX idx_cotiz_vendedor   ON cotizaciones(vendedor_id);

-- refresh tokens
CREATE INDEX idx_refresh_perfil   ON refresh_tokens(perfil_id);

-- ============================================================
-- TRIGGER: auto-crear vendedor_stats al crear un profile
-- ============================================================

CREATE OR REPLACE FUNCTION crear_vendedor_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO vendedor_stats (perfil_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_crear_vendedor_stats
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION crear_vendedor_stats();

-- ============================================================
-- TRIGGER: updated_at automatico
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at  BEFORE UPDATE ON profiles  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_leads_updated_at     BEFORE UPDATE ON leads     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_ventas_updated_at    BEFORE UPDATE ON ventas    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_noticias_updated_at  BEFORE UPDATE ON noticias  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
