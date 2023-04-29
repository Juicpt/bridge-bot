import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { BridgeService } from '../../bridge/bridge.service';

@WebSocketGateway(3001, { socketIo: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(EventsGateway.name);

  constructor(private bridgeService: BridgeService) {
  }

  handleConnection(client: Socket): any {
    const device = client?.request?.headers?.device as string;
    this.bridgeService.addDevices(device, client);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log('disconnect');
    const device = client?.request?.headers?.device as string;
    this.bridgeService.removeDevices(device);
  }


}
