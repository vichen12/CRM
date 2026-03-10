import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { LeadOrigen } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  telefono: string;

  @IsUUID()
  @IsOptional()
  zonaId?: string;

  @IsEnum(LeadOrigen)
  @IsOptional()
  origen?: LeadOrigen;

  @IsString()
  @IsOptional()
  notas?: string;
}
