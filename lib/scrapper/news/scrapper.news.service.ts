import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer, { Browser, Page } from 'puppeteer';
import { NewsItemDto } from './scrapper.news.dto';

@Injectable()
export class NewsScrapperService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser | null = null;
  private readonly HN_URL = 'https://news.ycombinator.com/';

  async onModuleInit(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({ headless: true });
      console.log('✅ Puppeteer browser launched for Hacker News scraping');
    } catch (error) {
      console.error('❌ Failed to launch Puppeteer:', error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('🛑 Puppeteer browser closed for Hacker News scraping');
    }
  }

  // Schedule the scraping job to run every hour
  // @Cron(CronExpression.EVERY_HOUR)
  async scrapeNews(): Promise<NewsItemDto[]> {
    let result = [] as NewsItemDto[];

    if (!this.browser) {
      console.error('❌ Browser is not initialized');
      return result;
    }

    const page: Page = await this.browser.newPage();

    try {
      console.log(`🔍 Navigating to Hacker News: ${this.HN_URL}`);
      await page.goto(this.HN_URL, { waitUntil: 'networkidle2' });

      // Extract news items.
      // Each news item is contained in a <tr> element with class "athing".
      // The title link is contained within an element with either the "storylink" class
      // or, more recently, within a ".titleline > a" element.
      const newsItems: NewsItemDto[] = await page.$$eval('.athing', (rows) =>
        rows.map((row) => {
          const titleElement =
            row.querySelector('.storylink') ||
            row.querySelector('.titleline > a');
          const title = titleElement
            ? titleElement.textContent?.trim() || 'Unknown'
            : 'Unknown';
          const url = titleElement
            ? titleElement.getAttribute('href') || ''
            : '';
          return { title, url };
        }),
      );
      result = newsItems || [];
      console.log('✅ Scraped Hacker News items:', newsItems?.length);
      return result;
      // Here, you might want to store the news items in a database or further process them.
    } catch (error) {
      console.error('❌ Error scraping Hacker News:', error);
    } finally {
      await page.close();
      console.log('🔒 Page closed after scraping');
    }

    return result;
  }
}
