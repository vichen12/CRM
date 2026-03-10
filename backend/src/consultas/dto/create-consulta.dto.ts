import { ConsultaEstado, ConsultaTipo } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateConsultaDto {
  @IsUUID()
  @IsOptional()
  clienteId?: string;

  @IsUUID()
  @IsOptional()
  leadId?: string;

  @IsEnum(ConsultaTipo)
  @IsOptional()
  tipo?: ConsultaTipo;

  @IsString()
  descripcion: string;
}

export class UpdateConsultaDto {
  @IsEnum(ConsultaEstado)
  @IsOptional()
  estado?: ConsultaEstado;

  @IsString()
  @IsOptional()
  resolucion?: string;
}
