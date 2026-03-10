import { VentaEstado } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVentaDto {
  @IsUUID()
  @IsOptional()
  leadId?: string;

  @IsUUID()
  @IsOptional()
  clienteId?: string;

  @IsUUID()
  @IsOptional()
  cotizacionId?: string;

  @IsString()
  producto: string;

  @IsString()
  @IsOptional()
  compania?: string;

  @IsNumber()
  @IsOptional()
  montoPrima?: number;

  @IsNumber()
  @IsOptional()
  montoComision?: number;

  @IsNumber()
  @IsOptional()
  porcentajeComision?: number;

  @IsEnum(VentaEstado)
  @IsOptional()
  estado?: VentaEstado;

  @IsDateString()
  fechaVenta: string;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsString()
  @IsOptional()
  notas?: string;
}
