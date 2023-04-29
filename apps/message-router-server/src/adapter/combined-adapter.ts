import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Server, ServerOptions, Socket } from 'socket.io';
import { KoishiWsAdapter } from 'koishi-nestjs';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';

export class CombinedAdapter extends KoishiWsAdapter {
  private ioAdapter: IoAdapter;

  constructor(appOrHttpServer?: INestApplicationContext | any) {
    super(appOrHttpServer);
    this.ioAdapter = new IoAdapter(appOrHttpServer);
  }

  bindClientDisconnect(client: Socket | WebSocket, callback: Function) {
    if (client instanceof Socket) {
      this.ioAdapter.bindClientDisconnect(client, callback);
      return;
    }
    super.bindClientDisconnect(client, callback);
  }

  public create(
    port: number,
    options?: ServerOptions & { namespace?: string; server?: any } & { socketIo: boolean }
  ): Server {
    if (options.socketIo) {
      return this.ioAdapter.create(port, options);
    }
    return super.create(port, options);
  }


  public bindMessageHandlers(
    socket: Socket | WebSocket,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>
  ) {
    if (socket instanceof Socket) {
      return this.ioAdapter.bindMessageHandlers(socket, handlers, transform);
    }
    return super.bindMessageHandlers(socket, handlers, transform);
  }

}
