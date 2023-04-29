import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Subject } from 'rxjs';

@Injectable()
export class BridgeService {
  devices: Map<string, Socket> = new Map();
  deviceSubject = new Subject<{ status: 'add'|'remove', socket?: Socket, device: string }>();

  addDevices(device: string, socket: Socket) {
    if (this.devices.has(device)) {
      return false;
    }
    this.devices.set(device, socket);
    this.deviceSubject.next({ status: 'add', socket, device });
  }

  removeDevices(device: string) {
    this.devices.delete(device);
    this.deviceSubject.next({ status: 'remove', device });
  }
}
