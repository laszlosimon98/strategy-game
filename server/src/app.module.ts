import { Module } from '@nestjs/common';
import { MessageSenderModule } from './handlers/message-sender/message-sender.module';
import { PlayerModule } from './handlers/player/player.module';
import { ConnectionModule } from './handlers/connection/connection.module';
import { ImageSenderModule } from './handlers/image-sender/image-sender.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameModule } from './handlers/game/game.module';

@Module({
  imports: [
    MessageSenderModule,
    PlayerModule,
    ConnectionModule,
    ImageSenderModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'assets'),
      serveRoot: '/assets',
    }),
    GameModule,
  ],
})
export class AppModule {}
