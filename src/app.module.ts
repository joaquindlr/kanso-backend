import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { EpicsModule } from './epics/epics.module';
import { IssuesModule } from './issues/issues.module';
import { CommentsModule } from './comments/comments.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';

import { User } from './users/domain/user.entity';
import { Project } from './projects/domain/project.entity';
import { Epic } from './epics/domain/epic.entity';
import { Issue } from './issues/domain/issue.entity';
import { Comment } from './comments/domain/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          ...(dbUrl
            ? { url: dbUrl }
            : {
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USER'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
              }),
          entities: [User, Project, Epic, Issue, Comment],
          synchronize:
            configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    EpicsModule,
    IssuesModule,
    CommentsModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
