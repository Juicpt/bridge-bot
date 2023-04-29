import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectContext, OnPrivate, UseEvent, WireContextService } from 'koishi-nestjs';
import { Context, DatabaseService, Session } from 'koishi';
import { BridgeService } from '../bridge/bridge.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private readonly commands = ['help', 'bind'];
  @WireContextService()
  private database: DatabaseService;

  constructor(private bridgeService: BridgeService, @InjectContext() private ctx: Context) {
  }

  @UseEvent('command-added')
  onCommandAdded(params) {
    this.commands.push(params.name);
  }

  checkAllElementsInStringStartWithOrWithoutPrefixes(prefixArray: string[], strArray: string[], targetStr: string): boolean {
    return strArray.some(element => {
      // 判断元素本身是否在目标字符串开头
      if (targetStr.startsWith(element)) {
        return true;
      }

      // 判断前缀+元素组合是否在目标字符串开头
      return prefixArray.some(prefix => targetStr.startsWith(prefix + element));
    });
  }


  @OnPrivate()
  @UseEvent('message')
  async onMessage(session: Session) {
    if (this.checkAllElementsInStringStartWithOrWithoutPrefixes(['.', '/'], this.commands, session.content)) {
      return;
    }
    const data = { platform: session.platform, pid: session.userId, data: session.content };
    if (this.bridgeService.devices.size === 0) {
      this.logger.log('不存在客户端...');
      await session.send('不存在客户端...');
      return;
    }
    for (const [device, socket] of this.bridgeService.devices) {
      await socket.send(data);
      // await session.send('发送成功!');
    }
  }

  onModuleInit(): any {
    this.bridgeService.deviceSubject.subscribe(({ status, socket, device }) => {
      if (status === 'remove') {
        this.logger.log(`准备移除客户端 ${device}的监听!`);
        socket && socket.removeAllListeners('message');
        this.logger.log(`成功移除${device}的监听!`);
        return;
      }
      socket.on('message', async (params) => {
        try {
          const data = typeof params === 'string' ? JSON.parse(params) : params;
          const pid = data.pid;
          const platform = data.platform;
          const tmp = data.data;
          const bot = this.ctx.bots[0];
          await bot.sendPrivateMessage(pid, tmp);
        } catch (e) {
          this.logger.warn(`客户端${device} 消息发送出现异常!`);
          socket.send({ pid: '', platform: '', data: e.message });
        }
      });
    });
  }
}
