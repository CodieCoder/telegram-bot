import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule'; // Import your service
import { NewsScrapperService } from './scrapper.news.service';

@Module({
  //   imports: [
  //    , // Import the ScheduleModule to enable cron jobs
  //   ],
  providers: [NewsScrapperService], // Register your service here
})
export class ScrapperModule {}
