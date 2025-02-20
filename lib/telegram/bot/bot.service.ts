import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { TelegramEnvDto } from 'config';
import { TelegramUpdate } from './bot.dto';
import { lastValueFrom, Observable } from 'rxjs';
import { ScrapTypeEnum } from 'lib/scrapper/scrapper.dto';
import { TelegramCommandResponses } from './constants';
import { ScrapperService } from 'lib/scrapper/scrapper.service';

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
    private readonly scrapper: ScrapperService,
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
    if (!data?.message?.text) {
      console.error('Error: No message text found in handleMessage');
      return;
    }

    try {
      const message = data.message.text.trim();
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

  public async sendToMany(chatIds: string[], text: string) {
    try {
      if (!chatIds?.length || !text?.length) return;
      else {
        chatIds.forEach((chatId) => this.sendMessage(chatId, text));
      }
    } catch (error) {
      console.log('****** ERROR *******');
      console.log(error);
    }
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
    const formattedCommand = command.toLowerCase();
    switch (formattedCommand) {
      case 'start':
        return TelegramCommandResponses.start;
      case 'news':
        return this.getResource(ScrapTypeEnum.News);
      case 'jobs':
        return this.getResource(ScrapTypeEnum.News);
      default:
        return TelegramCommandResponses.default;
    }
  }

  private async getResource(type: ScrapTypeEnum) {
    let tmp: any;
    switch (type) {
      case ScrapTypeEnum.News:
        tmp = await this.scrapper.news();
        return tmp
          ?.map((news) => `${news.title} \n ${news.url} \n \n \n`)
          .join('\n');
          
      case ScrapTypeEnum.Jobs:
        tmp = await this.scrapper.jobs();
        return tmp?.map((job) => `${job.title} \n ${job.url} \n \n \n`);
      default:
        return [];
    }
  }
}
