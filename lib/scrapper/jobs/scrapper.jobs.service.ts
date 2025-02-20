import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ScrapperJobsDto } from './scrapper.jobs.dto';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScrapperForJobsService implements OnModuleInit, OnModuleDestroy {
  private browser: puppeteer.Browser | null = null;
  private readonly HACKER_JOBS_URL =
    'https://www.ycombinator.com/jobs/role/software-engineer/remote';

  async onModuleInit(): Promise<void> {
    await this.launchBrowser();
  }

  async onModuleDestroy(): Promise<void> {
    await this.closeBrowser();
  }

  private async launchBrowser(): Promise<void> {
    try {
      // await this.cleanupZombieProcesses();
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      console.log('Puppeteer browser launched for YC Jobs scraping');
    } catch (error) {
      console.error('Failed to launch Puppeteer:', error);
      this.handleError(error);
    }
  }

  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      try {
        await this.browser.close();
        console.log('Puppeteer browser closed for YC Jobs scraping');
      } catch (error) {
        console.error('Error closing Puppeteer browser:', error);
        this.handleError(error);
      } finally {
        this.browser = null;
      }
    }
  }

  async scrape(): Promise<ScrapperJobsDto[]> {
    if (!this.browser) {
      const error = new Error('Browser is not initialized');
      console.error(error.message);
      this.handleError(error);
      return [];
    }

    let page: puppeteer.Page | null = null;
    try {
      page = await this.browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      );
      await page.goto(this.HACKER_JOBS_URL, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });
      await page.waitForSelector('div[data-job-id]', { timeout: 30000 });

      const jobPostings = await page.evaluate(() => {
        const jobElements = document.querySelectorAll('div[data-job-id]');
        return Array.from(jobElements).map((element) => {
          const title = element.getAttribute('data-job-title') || '';
          const companyDescription =
            element.getAttribute('data-company-description') || '';
          const postedDate = element.getAttribute('data-posted-date') || '';
          const role = element.getAttribute('data-job-role') || '';
          const location = element.getAttribute('data-job-location') || '';
          const jobLink =
            (element.querySelector('a') as HTMLAnchorElement)?.href || '';
          const companyName = element.getAttribute('data-company-name') || '';

          return {
            id: new Date().getTime().toString(),
            title,
            companyDescription,
            postedDate,
            role,
            location,
            jobLink,
            companyName,
          };
        });
      });

      return jobPostings;
    } catch (error) {
      console.error('Error extracting job details:', error);
      this.handleError(error);
      return [];
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (closeError) {
          console.error('Error closing page:', closeError);
          this.handleError(closeError);
        }
      }
    }
  }

  private handleError(error: Error): void {
    // Implement your custom error handling logic here
    console.error('Custom error handling:', error.message);
  }
}
