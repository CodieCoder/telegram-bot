import { Module } from '@nestjs/common';
import { TelegramBotService } from './bot.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScrapperModule } from 'lib/scrapper/news/scapper.news.module';
import { NewsScrapperService } from 'lib/scrapper/news/scrapper.news.service';

@Module({
  imports: [ConfigModule, HttpModule, ScrapperModule],
  providers: [TelegramBotService, NewsScrapperService],
})
export class TelegramBotModule {}
