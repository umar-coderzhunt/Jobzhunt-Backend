import { registerAs } from '@nestjs/config';
import { ConfigEnum } from '../shared/enums/server.enum';
import { DocumentBuilder } from '@nestjs/swagger';

export default registerAs(ConfigEnum.SWAGGER, () => ({
  path: 'docs',
  documentBuilder: new DocumentBuilder()
    .setTitle('JobHunt AI')
    .setDescription('JobHunt AI REST API documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build(),
}));
