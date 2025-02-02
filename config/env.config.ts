import { EnvConfigurationDto } from './dto.config';

const ENV = (): EnvConfigurationDto => ({
  port: parseInt(process.env.PORT || '3000', 10) || 3000,
  telegram: {
    token: process.env.TELEGRAM_TOKEN || '',
    url: process.env.TELEGRAM_BOT_API || '',
    allowedIds: process.env.ALLOWED_CHAT_IDS
      ? process.env.ALLOWED_CHAT_IDS.split(',')
      : ([] as any),
  },
  database: {
    host: process.env.DATABASE_HOS || '',
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
  },
});

export default ENV;
