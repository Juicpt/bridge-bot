import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KoishiModule, PluginDef } from 'koishi-nestjs';
import { EventsModule } from './events/events.module';
import Console from '@koishijs/plugin-console';
import * as sandbox from '@koishijs/plugin-sandbox';
import * as echo from '@koishijs/plugin-echo';
import * as analytics from '@koishijs/plugin-analytics';
import commands from '@koishijs/plugin-commands';
import explorer from '@koishijs/plugin-explorer';
import insight from '@koishijs/plugin-insight';
import logger from '@koishijs/plugin-logger';
import * as Status from '@koishijs/plugin-status';
import Login from '@koishijs/plugin-login';
import PluginOnebot from '@koishijs/plugin-adapter-onebot';
import * as admin from '@koishijs/plugin-admin';
import * as bind from '@koishijs/plugin-bind';
import * as callme from '@koishijs/plugin-callme';
import dataview from '@koishijs/plugin-dataview';
import * as help from '@koishijs/plugin-help';
import * as inspect from '@koishijs/plugin-inspect';
import * as rateLimit from '@koishijs/plugin-rate-limit';
import databaseSqlite from '@koishijs/plugin-database-sqlite';
import * as schedule from 'koishi-plugin-schedule';
import { BridgeModule } from '../bridge/bridge.module';

@Module({
  imports: [
    BridgeModule,
    KoishiModule.register({
      // 在这里填写 Koishi 配置参数
      prefix: ['.', '/'],
      useWs: false,
      autoAuthorize: 0,
      autoAssign: false,
      usePlugins: [
        // 预安装的插件
        PluginDef(databaseSqlite, { path: 'koishi.db' }),
        PluginDef(Console, {
          open: false,
          devMode: false,
          uiPath: '/api/console',
          apiPath: '/api/status'
        }),
        PluginDef(sandbox),
        PluginDef(echo),
        PluginDef(commands),
        PluginDef(insight),
        PluginDef(logger),
        PluginDef(analytics),
        PluginDef(explorer),
        PluginDef(Status),
        PluginDef(Login, {
          admin: {
            enabled: true,
            username: '',
            password: ''
          }
        }),
        PluginDef(admin),
        PluginDef(bind),
        PluginDef(callme),
        PluginDef(dataview),
        PluginDef(help),
        PluginDef(inspect),
        PluginDef(rateLimit),
        PluginDef(schedule),
        PluginDef(PluginOnebot, {
          protocol: 'ws',
          endpoint: 'ws://localhost:8080',
          selfId: '12345678'
        })
      ]

    }),
    EventsModule
  ],
  providers: [AppService
  ]
})
export class AppModule {
}
