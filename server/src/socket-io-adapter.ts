import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';

export class SocketIoAdapter extends IoAdapter {
  constructor(app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      },
    });
  }
}
