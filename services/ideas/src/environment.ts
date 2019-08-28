import { Logger } from '@cents-ideas/utils';

const env = {
  environment: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  database: {
    ideasCollectionName: 'ideas',
    url: process.env.IDEAS_SERVICE_DATABASE_URL || 'mongodb://ideas-db:27017',
    name: process.env.NODE_ENV || 'test'
  },
  port: 3000,
  logger: new Logger('💡')
};

export default env;
