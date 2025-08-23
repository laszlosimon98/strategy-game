import { forwardRef, Module } from '@nestjs/common';
import { MessageSenderService } from './message-sender.service';
import { PlayerModule } from '@/src/handlers/player/player.module';

@Module({
  providers: [MessageSenderService],
  exports: [MessageSenderService],
  imports: [forwardRef(() => PlayerModule)],
})
export class MessageSenderModule {}
