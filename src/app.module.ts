import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configurations from 'config';
import { TelegramBotModule } from 'lib/telegram/bot/bot.module';
import { TelegramBotService } from 'lib/telegram/bot/bot.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ScrapperModule } from 'lib/scrapper/news/scapper.news.module';
import { NewsScrapperService } from 'lib/scrapper/news/scrapper.news.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations.ENV],
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    TelegramBotModule,
    ScrapperModule,
  ],
  controllers: [AppController],
  providers: [AppService, TelegramBotService, NewsScrapperService],
})
export class AppModule {}
