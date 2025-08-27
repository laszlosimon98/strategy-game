import { Module } from '@nestjs/common';
import { GameStartGateway } from './game-start.gateway';
import { MessageSenderModule } from '@/src/handlers/message-sender/message-sender.module';

@Module({
  providers: [GameStartGateway],
  imports: [MessageSenderModule],
})
export class GameStartModule {}
