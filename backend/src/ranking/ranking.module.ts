import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { KpisModule } from '../kpis/kpis.module';

@Module({
  imports: [KpisModule],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
