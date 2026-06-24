import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './domain/comment.entity';
import { CommentRepository } from './domain/comment.repository';
import { TypeOrmCommentRepository } from './infrastructure/persistence/typeorm-comment.repository';
import { CommentsController } from './infrastructure/controllers/comments.controller';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { FindCommentsByIssueUseCase } from './application/use-cases/find-comments-by-issue.use-case';
import { IssuesModule } from '../issues/issues.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    IssuesModule,
    ProjectsModule,
  ],
  controllers: [CommentsController],
  providers: [
    {
      provide: CommentRepository,
      useClass: TypeOrmCommentRepository,
    },
    CreateCommentUseCase,
    FindCommentsByIssueUseCase,
  ],
})
export class CommentsModule {}
