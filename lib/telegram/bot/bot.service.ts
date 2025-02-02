import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { TelegramEnvDto } from 'config';
import { TelegramUpdate } from './bot.dto';
import { lastValueFrom, Observable } from 'rxjs';
import { ScrapTypeDto } from 'lib/scrapper/scrapper.dto';
import { NewsScrapperService } from 'lib/scrapper/news/scrapper.news.service';
import { TelegramCommandResponses } from './constants';

@Injectable()
export class TelegramBotService {
  private readonly URL: string;
  private readonly ALLOWED_CHAT_IDS: string[];
  private readonly api: {
    get(method: string, params?: any): Observable<AxiosResponse>;
    post(method: string, data: any): Observable<AxiosResponse>;
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly scrapper: NewsScrapperService,
  ) {
    const env = this.configService.get<TelegramEnvDto>('telegram');
    if (!env?.url || !env?.allowedIds?.length || !env?.token) {
      throw new Error('Invalid Telegram configuration');
    }

    this.URL = `${env.url}/bot${env.token}`;
    this.ALLOWED_CHAT_IDS = env.allowedIds;
    this.api = this.initTelegramApi();
  }

  public async handleMessage(data: TelegramUpdate): Promise<void> {
    const message = data.message.text?.trim();
    if (!message) {
      console.error('Error: No message text found in handleMessage');
      return;
    }

    try {
      const chatId = String(data.message.chat.id);

      if (this.ALLOWED_CHAT_IDS.includes(chatId)) {
        if (message.startsWith('/')) {
          const command = message.substring(1);
          return this.processCommand(chatId, command);
        }
        return this.sendMessage(
          chatId,
          "Sorry, you have to join 'TechSquare' before I can assist you.",
        );
      }

      return this.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error in handleMessage:', error);
    }
  }

  private async processCommand(chatId: string, command: string): Promise<void> {
    const response = await this.executeCommand(command);
    return this.sendMessage(chatId, response);
  }

  private async sendMessage(chatId: string, text: any): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.api.post('sendMessage', { chat_id: chatId, text }),
      );
      console.log(`Message sent to ${chatId}. Success ==> `, response.data?.ok);
    } catch (error) {
      console.error(
        `Failed to send message to ${chatId}:`,
        error.response?.data || error.message,
      );
    }
  }

  private initTelegramApi() {
    return {
      get: (method: string, params?: any) =>
        this.httpService.get(`${this.URL}/${method}`, { params }),

      post: (method: string, data: any) => {
        return this.httpService.post(`${this.URL}/${method}`, data);
      },
    };
  }

  private async executeCommand(command: string) {
    switch (command) {
      case 'start':
        return TelegramCommandResponses.start;
      case 'news':
        return this.getResource(ScrapTypeDto.News);
      default:
        return TelegramCommandResponses.default;
    }
  }

  private async getResource(type: ScrapTypeDto) {
    let tmp: any;
    switch (type) {
      case ScrapTypeDto.News:
        tmp = await this.scrapper.scrapeNews();
        return tmp
          ?.map((news) => `${news.title} \n ${news.url} \n \n \n`)
          .join('\n');
      default:
        return [];
    }
  }
}
