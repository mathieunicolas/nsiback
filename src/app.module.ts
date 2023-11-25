import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ActivitiesModule } from './activity/activities.module';
import { Activity } from './activity/activity.entity';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from '@squareboat/nest-storage';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Activity],
      synchronize: true,
    }),
    StorageModule.register({
      default: 'test',
      disks: {
        test: {
          driver: 'local',
          basePath: './files',
        },
      },
    }),
    UsersModule,
    ActivitiesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
