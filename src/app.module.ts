import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from './config/env.validation';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { LinksModule } from './links/links.module';
import { Link } from './links/entities/link.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mssql',
          host: configService.get('database').host,
          port: configService.get('database').port,
          username: configService.get('database').username,
          password: configService.get('database').password,
          database: configService.get('database').database,
          entities: [User, Link],
          synchronize:
            configService.get('node_env') === Environment.Development,
          extra: {
            trustServerCertificate:
              configService.get('node_env') === Environment.Development,
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CloudinaryModule,
    LinksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
