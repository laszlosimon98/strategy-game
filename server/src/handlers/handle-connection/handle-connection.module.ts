import { Module } from '@nestjs/common';
import { HandleConnectionService } from './handle-connection.service';
import { HandleConnectionGateway } from './handle-connection.gateway';
import { MessageSenderModule } from '@/src/handlers/message-sender/message-sender.module';
import { PlayerModule } from '@/src/handlers/player/player.module';

@Module({
  providers: [HandleConnectionGateway, HandleConnectionService],
  imports: [MessageSenderModule, PlayerModule],
})
export class HandleConnectionModule {}
