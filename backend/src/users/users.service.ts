import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RolTipo } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(id: string) {
    const user = await this.prisma.profile.findUnique({
      where: { id },
      select: {
        id: true, email: true, nombre: true, apellido: true,
        telefono: true, rol: true, matricula: true, activo: true,
        avatarUrl: true, createdAt: true,
        zona: true,
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async updateMe(id: string, data: { nombre?: string; apellido?: string; telefono?: string; avatar_url?: string }) {
    if (data.nombre !== undefined && !data.nombre.trim()) {
      throw new BadRequestException('El nombre no puede estar vacío');
    }
    if (data.apellido !== undefined && !data.apellido.trim()) {
      throw new BadRequestException('El apellido no puede estar vacío');
    }
    return this.prisma.profile.update({
      where: { id },
      data: {
        ...(data.nombre && { nombre: data.nombre.trim() }),
        ...(data.apellido && { apellido: data.apellido.trim() }),
        ...(data.telefono !== undefined && { telefono: data.telefono.trim() || null }),
        ...(data.avatar_url !== undefined && { avatarUrl: data.avatar_url || null }),
      },
      select: {
        id: true, email: true, nombre: true, apellido: true,
        telefono: true, rol: true, matricula: true, activo: true,
        avatarUrl: true, createdAt: true, zona: true,
      },
    });
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('La contraseña nueva debe tener al menos 8 caracteres');
    }

    const user = await this.prisma.profile.findUnique({
      where: { id },
      select: { passwordHash: true },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('La contraseña actual es incorrecta');

    const newHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.profile.update({
      where: { id },
      data: { passwordHash: newHash },
    });
    return { message: 'Contraseña actualizada correctamente' };
  }

  async getVendedores() {
    return this.prisma.profile.findMany({
      where: { rol: { in: [RolTipo.vendedor_matriculado, RolTipo.vendedor_sin_matricula] } },
      select: {
        id: true, nombre: true, apellido: true, email: true,
        telefono: true, rol: true, matricula: true, activo: true,
        zona: true, createdAt: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async crear(data: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    rol: RolTipo;
    zonaId?: string;
    matricula?: string;
  }) {
    const existe = await this.prisma.profile.findUnique({ where: { email: data.email } });
    if (existe) throw new ConflictException('El email ya esta registrado');

    const passwordHash = await bcrypt.hash(data.password, 10);

    const { password: _pw, ...rest } = data as any;
    const user = await this.prisma.profile.create({
      data: { ...rest, passwordHash },
      select: {
        id: true, email: true, nombre: true, apellido: true,
        rol: true, activo: true, createdAt: true,
      },
    });

    // Crear stats iniciales
    await this.prisma.vendedorStats.create({ data: { perfilId: user.id } });

    return user;
  }

  async actualizar(id: string, data: { activo?: boolean; zonaId?: string; telefono?: string }) {
    return this.prisma.profile.update({
      where: { id },
      data,
      select: {
        id: true, email: true, nombre: true, apellido: true,
        rol: true, activo: true, zona: true,
      },
    });
  }
}
