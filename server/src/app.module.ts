import { Module } from '@nestjs/common';
import { MessageSenderModule } from './handlers/message-sender/message-sender.module';
import { PlayerModule } from './handlers/player/player.module';
import { ConnectionModule } from './handlers/connection/connection.module';

@Module({
  imports: [MessageSenderModule, PlayerModule, ConnectionModule],
})
export class AppModule {}
