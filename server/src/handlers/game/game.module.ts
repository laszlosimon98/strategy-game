import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MessageSenderModule } from '@/src/handlers/message-sender/message-sender.module';
import { GameService } from './game.service';
import { PlayerModule } from '@/src/handlers/player/player.module';
import { InitModule } from './init/init.module';
import { WorldModule } from './world/world.module';

@Module({
  providers: [GameGateway, GameService],
  imports: [MessageSenderModule, PlayerModule, InitModule, WorldModule],
})
export class GameModule {}
