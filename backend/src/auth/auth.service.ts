import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.profile.findUnique({ where: { email: dto.email } });

    if (!user || !user.activo) throw new UnauthorizedException('Credenciales invalidas');

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordOk) throw new UnauthorizedException('Credenciales invalidas');

    await this.prisma.profile.update({
      where: { id: user.id },
      data: { ultimoAcceso: new Date() },
    });

    return this.generateTokens(user.id, user.email);
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token } });

    if (!stored || stored.revocado || stored.expiresAt < new Date()) {
      throw new ForbiddenException('Refresh token invalido o expirado');
    }

    // Rotar el refresh token
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revocado: true },
    });

    return this.generateTokens(stored.perfilId, '');
  }

  async logout(token: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { revocado: true },
    });
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: { perfilId: userId, token: refreshToken, expiresAt },
    });

    return { accessToken, refreshToken };
  }
}
