import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: parseInt(process.env.BACKEND_APP_PORT) || 8081,
  prefix: process.env.ENDPOINT_PREFIX || 'api',
  apiUrl: process.env.API_URL || 'http://localhost',
}));
