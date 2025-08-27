import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionGateway } from './connection.gateway';
import { MessageSenderModule } from '@/src/handlers/message-sender/message-sender.module';
import { PlayerModule } from '@/src/handlers/player/player.module';

@Module({
  providers: [ConnectionGateway, ConnectionService],
  imports: [MessageSenderModule, PlayerModule],
})
export class ConnectionModule {}
