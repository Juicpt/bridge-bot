import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KoishiModule, PluginDef } from 'koishi-nestjs';
import console from '@koishijs/plugin-console';
import * as sandbox from '@koishijs/plugin-sandbox';
import * as echo from '@koishijs/plugin-echo';

@Module({
  imports: [KoishiModule.register({
    // 在这里填写 Koishi 配置参数
    prefix: '.',
    useWs: true,
    usePlugins: [
      // 预安装的插件
      PluginDef(console, { open: true,devMode:true }),
      PluginDef(sandbox),
      PluginDef(echo)
      // PluginDef(PluginOnebot, {
      //   protocol: 'ws',
      //   endpoint: 'ws://localhost:6700',
      //   selfId: '111514',
      //   token: 'koishi',
      // }),
    ]
  })],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
