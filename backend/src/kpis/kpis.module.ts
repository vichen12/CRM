import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KpisController } from './kpis.controller';
import { KpisService } from './kpis.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [KpisController],
  providers: [KpisService],
  exports: [KpisService],
})
export class KpisModule {}
