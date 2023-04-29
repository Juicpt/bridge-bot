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
    if (!device) {
      this.logger.log('未获取到设备代码，中断!');
      client.disconnect(true);
      return;
    }
    this.logger.log(`客户端 ${device} 成功连接!`);
    this.bridgeService.addDevices(device, client);
  }

  handleDisconnect(client: Socket): void {
    const device = client?.request?.headers?.device as string;
    if (!device) {
      this.logger.log('非法设备断开!')
      return;
    }
    this.logger.log(`客户端 ${device} 断开连接!`);
    this.bridgeService.removeDevices(device);
  }


}
