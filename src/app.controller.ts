import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NewsScrapperService } from 'lib/scrapper/news/scrapper.news.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly scrapper: NewsScrapperService,
  ) {}

  @Get('/')
  getHello(): string {
    console.log(`GET SERVER ACCESS: ${new Date().toISOString()}`);
    return this.appService.getHello();
  }

  @Post()
  handlePost(@Body() body: any) {
    console.log(`POST SERVER ACCESS: ${new Date().toISOString()}`);
    // console.log('Received Telegram Webhook Body:', body);
    return this.appService.telegramBotHandler(body);
  }

  @Get('scrap/news')
  getNews(): any {
    const result = this.scrapper.scrapeNews();
    console.log(result);
    return result;
  }
}
