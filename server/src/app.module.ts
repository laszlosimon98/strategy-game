import { Module } from '@nestjs/common';
import { MessageSenderModule } from './handlers/message-sender/message-sender.module';
import { HandleConnectionModule } from './handlers/handle-connection/handle-connection.module';
import { PlayerModule } from './handlers/player/player.module';

@Module({
  imports: [MessageSenderModule, HandleConnectionModule, PlayerModule],
})
export class AppModule {}
