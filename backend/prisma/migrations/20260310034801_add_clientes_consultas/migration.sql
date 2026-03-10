-- CreateEnum
CREATE TYPE "ConsultaTipo" AS ENUM ('nueva_poliza', 'renovacion', 'reclamo', 'informacion', 'otro');

-- CreateEnum
CREATE TYPE "ConsultaEstado" AS ENUM ('pendiente', 'en_proceso', 'resuelta', 'cancelada');

-- AlterTable
ALTER TABLE "ventas" ADD COLUMN     "cliente_id" TEXT;

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "vendedor_id" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "telefono" VARCHAR(50) NOT NULL,
    "direccion" TEXT,
    "localidad" TEXT,
    "provincia" TEXT,
    "fecha_nacimiento" DATE,
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas" (
    "id" TEXT NOT NULL,
    "vendedor_id" TEXT NOT NULL,
    "cliente_id" TEXT,
    "lead_id" TEXT,
    "tipo" "ConsultaTipo" NOT NULL DEFAULT 'informacion',
    "estado" "ConsultaEstado" NOT NULL DEFAULT 'pendiente',
    "descripcion" TEXT NOT NULL,
    "resolucion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clientes_vendedor_id_idx" ON "clientes"("vendedor_id");

-- CreateIndex
CREATE INDEX "clientes_apellido_idx" ON "clientes"("apellido");

-- CreateIndex
CREATE INDEX "consultas_vendedor_id_idx" ON "consultas"("vendedor_id");

-- CreateIndex
CREATE INDEX "consultas_cliente_id_idx" ON "consultas"("cliente_id");

-- CreateIndex
CREATE INDEX "consultas_estado_idx" ON "consultas"("estado");

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
