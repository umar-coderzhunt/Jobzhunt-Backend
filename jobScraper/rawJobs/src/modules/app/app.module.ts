import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { GlobalJwtModule } from '../globalJwt/globalJwt.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RawJobsModule } from '../rawJobs/rawJobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProfileModule } from '../profile/profile.module';
import { MatureJobsModule } from '../matureJobs/matureJobs.module';
import serverConfig from 'src/config/server.config';
import swaggerConfig from 'src/config/swagger.config';
import databaseConfig from 'src/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
      load: [serverConfig, databaseConfig, swaggerConfig],
    }),
    GlobalJwtModule,
    MongooseModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    RawJobsModule,
    ProfileModule,
    MatureJobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
