import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule'; // Import your service
import { ScrapperForJobsService } from './scrapper.jobs.service';

@Module({
  //   imports: [
  //    , // Import the ScheduleModule to enable cron jobs
  //   ],
  providers: [ScrapperForJobsService], // Register your service here
})
export class ScrapperForJobsModule {}
