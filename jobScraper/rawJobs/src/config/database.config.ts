import { registerAs } from '@nestjs/config';
import { ConfigEnum } from 'src/shared/enums/server.enum';

export default registerAs(ConfigEnum.MONGO, () => ({
  uri: `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'jobzhunt-ai'}`,
}));
