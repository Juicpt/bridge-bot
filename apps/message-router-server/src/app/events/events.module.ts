import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { BridgeModule } from '../../bridge/bridge.module';

@Module({
  imports: [BridgeModule],
  providers: [EventsGateway]
})
export class EventsModule {
}
