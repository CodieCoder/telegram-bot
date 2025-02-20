import { Injectable } from '@nestjs/common';
import { TelegramBotService } from 'lib/telegram/bot/bot.service';

@Injectable()
export class AppService {
  constructor(private telegramBotService: TelegramBotService) {}

  getHello(): string {
    return 'Hello World! : ' + new Date().toISOString();
  }

  public telegramBotHandler(body: any) {
    return this.telegramBotService.handleMessage(body);
  }

  public sendToMany(chatIds: string[], text: string) {
    return this.telegramBotService.sendToMany(chatIds, text);
  }
}
