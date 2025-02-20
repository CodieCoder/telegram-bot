import { Injectable } from '@nestjs/common';
import { ScrapperForNewsService } from './news/scrapper.news.service';
import { ScrapperForJobsService } from './jobs/scrapper.jobs.service';
import { ScrapperNewsDto } from './news/scrapper.news.dto';
import { ScrapperJobsDto } from './jobs/scrapper.jobs.dto';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly newsService: ScrapperForNewsService,
    private readonly jobsService: ScrapperForJobsService,
  ) {}

  public async news(): Promise<ScrapperNewsDto[]> {
    return this.newsService.scrape();
  }

  public async jobs(): Promise<ScrapperJobsDto[]> {
    return this.jobsService.scrape();
  }
}
