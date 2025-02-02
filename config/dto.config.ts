export interface TelegramEnvDto {
  token: string;
  url: string;
  allowedIds: string[];
}

export interface EnvConfigurationDto {
  port: number;
  telegram: TelegramEnvDto;
  database: {
    host: string;
    port: number;
  };
}
