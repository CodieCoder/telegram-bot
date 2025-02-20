import { Module } from '@nestjs/common';
import { ScrapperForNewsService } from './news/scrapper.news.service';
import { ScrapperForJobsService } from './jobs/scrapper.jobs.service';
import { ScrapperForJobsModule } from './jobs/scrapper.jobs.module';
import { ScrapperForNewsModule } from './news/scapper.news.module';
import { ScrapperService } from './scrapper.service';

@Module({
  imports: [ScrapperForJobsModule, ScrapperForNewsModule],
  providers: [ScrapperService, ScrapperForNewsService, ScrapperForJobsService],
  exports: [ScrapperForNewsService, ScrapperForJobsService],
})
export class ScrapperModule {}
