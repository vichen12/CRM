import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { VentasModule } from './ventas/ventas.module';
import { KpisModule } from './kpis/kpis.module';
import { RankingModule } from './ranking/ranking.module';
import { UsersModule } from './users/users.module';
import { ZonasModule } from './zonas/zonas.module';
import { NoticiasModule } from './noticias/noticias.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { DocumentosModule } from './documentos/documentos.module';
import { ClientesModule } from './clientes/clientes.module';
import { ConsultasModule } from './consultas/consultas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    LeadsModule,
    VentasModule,
    KpisModule,
    RankingModule,
    UsersModule,
    ZonasModule,
    NoticiasModule,
    NotificacionesModule,
    DocumentosModule,
    ClientesModule,
    ConsultasModule,
  ],
})
export class AppModule {}
