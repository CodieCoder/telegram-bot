import { Module } from '@nestjs/common';
import { TelegramBotService } from './bot.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScrapperModule } from 'lib/scrapper/scrapper.module';
import { ScrapperService } from 'lib/scrapper/scrapper.service';

@Module({
  imports: [ConfigModule, HttpModule, ScrapperModule],
  providers: [TelegramBotService, ScrapperService],
})
export class TelegramBotModule {}
