import { Module } from '@nestjs/common';
import { WorldService } from './world.service';
import { PlayerModule } from '@/src/handlers/player/player.module';

@Module({
  providers: [WorldService],
  exports: [WorldService],
  imports: [PlayerModule],
})
export class WorldModule {}
