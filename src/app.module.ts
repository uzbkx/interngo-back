import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ListingsModule } from './listings/listings.module';
import { ApplicationsModule } from './applications/applications.module';
import { SavedModule } from './saved/saved.module';
import { AdminModule } from './admin/admin.module';
import { ScouterModule } from './scouter/scouter.module';
import { ContactModule } from './contact/contact.module';

const MONGODB_ATLAS = 'mongodb+srv://ahmadjoony:bs55npMweOkjtsF7@cluster0.lg2uevr.mongodb.net/interngo?retryWrites=true&w=majority';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') || MONGODB_ATLAS,
      }),
    }),

    ScheduleModule.forRoot(),

    AuthModule,
    UsersModule,
    OrganizationsModule,
    ListingsModule,
    ApplicationsModule,
    SavedModule,
    AdminModule,
    ScouterModule,
    ContactModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
