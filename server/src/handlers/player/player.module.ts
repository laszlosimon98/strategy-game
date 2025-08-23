import { forwardRef, Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { MessageSenderModule } from '@/src/handlers/message-sender/message-sender.module';

@Module({
  providers: [PlayerService],
  exports: [PlayerService],
  imports: [forwardRef(() => MessageSenderModule)],
})
export class PlayerModule {}
