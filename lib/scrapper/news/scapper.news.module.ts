import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule'; // Import your service
import { ScrapperForNewsService } from './scrapper.news.service';

@Module({
  //   imports: [
  //    , // Import the ScheduleModule to enable cron jobs
  //   ],
  providers: [ScrapperForNewsService], // Register your service here
})
export class ScrapperForNewsModule {}
