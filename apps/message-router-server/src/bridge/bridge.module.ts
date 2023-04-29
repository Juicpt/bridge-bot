import { Module } from '@nestjs/common';
import { BridgeService } from './bridge.service';

@Module({
  providers: [BridgeService],
  exports: [BridgeService]
})
export class BridgeModule {
}
