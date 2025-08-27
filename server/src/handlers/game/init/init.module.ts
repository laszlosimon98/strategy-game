import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { PlayerModule } from '@/src/handlers/player/player.module';
import { WorldModule } from '@/src/handlers/game/world/world.module';

@Module({
  providers: [InitService],
  exports: [InitService],
  imports: [PlayerModule, WorldModule],
})
export class InitModule {}
