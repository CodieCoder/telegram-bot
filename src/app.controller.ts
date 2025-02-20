import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ScrapperService } from 'lib/scrapper/scrapper.service';

interface IPostNewsToChatIds {
  chatIds: string[];
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly scrapper: ScrapperService,
  ) {}

  @Get('/')
  getHello(): string {
    console.log(`GET SERVER ACCESS: ${new Date().toISOString()}`);
    return this.appService.getHello();
  }

  @Post()
  handlePost(@Body() body: any) {
    console.log(`POST SERVER ACCESS: ${new Date().toISOString()}`);
    console.log('Received Telegram Webhook Body:', body);
    return this.appService.telegramBotHandler(body);
  }

  @Get('scrap/news')
  getNews(): any {
    const result = this.scrapper.news();
    console.log(result);
    return result;
  }

  @Post('scrap/news')
  async sendNewsToGroup(@Body() body: IPostNewsToChatIds) {
    const result = await this.scrapper.news();
    const news = JSON.stringify(result);
    if (news?.length) {
      return this.appService.sendToMany(body.chatIds, news);
    } else {
      return 'Error';
    }
  }

  //Jobs
  @Get('scrap/jobs')
  getJobs(): any {
    const result = this.scrapper.jobs();
    console.log(result);
    return result;
  }
}
