import Redis from 'ioredis';

import logger from './logger';
import * as appMeta from '../package.json';

export const resqueConfig = {
  pkg: 'ioredis',
  namespace: `${appMeta.name}:resque`,
  port: process.env.REDIS_SERVER_PORT || 6379,
  host: process.env.REDIS_SERVER_HOST || '127.0.0.1',
  password: process.env.REDIS_SERVER_PASSWORD || null,
  looping: true,
  database: 0,
};

export const redis = new Redis({
  keyPrefix: `${appMeta.name}:`,
  port: process.env.REDIS_SERVER_PORT || 6379,
  host: process.env.REDIS_SERVER_HOST || '127.0.0.1',
  password: process.env.REDIS_SERVER_PASSWORD || undefined,
}).on('error', (error) => {
  if (error.code === 'ECONNREFUSED') {
    logger('info', 'requirements: redis (v2.0.0 or above) must be running.');
  }

  logger('error', 'redis:', `${error.code}\n`);

  throw error;
});

export const mongodb = {
  fullUri: process.env.MONGODB_SERVER_URI || 'mongodb://localhost:27017/metricio',
  host: `mongodb://${process.env.MONGODB_SERVER_HOST || 'localhost'}`,
  port: process.env.MONGODB_SERVER_PORT || 27017,
  dbName: process.env.MONGODB_DB || 'metricio',
  user: process.env.MONGODB_USER || undefined,
  pass: process.env.MONGODB_PASS || undefined,
  // bufferCommands: process.env.MONGOOSE_BUFF_COMMANDS || undefined,
  autoIndex: process.env.MONGODB_AUTOINDEX || true,
  mongooseUri() {
    const hostName = this.host;
    const portNumber = this.port;
    return `${hostName}:${portNumber}`;
  },
  mongooseOptions() {
    return {
      dbName: this.dbName,
      user: this.user,
      pass: this.pass,
      bufferCommands: this.bufferCommands,
      autoIndex: this.autoIndex,
    };
  },
};
