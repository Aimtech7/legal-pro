import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        let uri = configService.get<string>('MONGODB_URI');
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('Development environment detected. Launching local in-memory MongoDB fallback...');
          try {
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
            console.log(`In-memory MongoDB started successfully at: ${uri}`);
          } catch (err) {
            console.warn('Could not launch in-memory MongoDB, falling back to configured MONGODB_URI:', (err as any).message);
          }
        }
        
        if (!uri) {
          console.log('No MongoDB URI provided, skipping database connection');
          return {};
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    HealthModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}