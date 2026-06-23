import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './domain/issue.entity';
import { IssueRepository } from './domain/issue.repository';
import { TypeOrmIssueRepository } from './infrastructure/persistence/typeorm-issue.repository';
import { IssuesController } from './infrastructure/controllers/issues.controller';
import { CreateStoryUseCase } from './application/use-cases/create-story.use-case';
import { CreateBugUseCase } from './application/use-cases/create-bug.use-case';
import { FindIssuesByProjectUseCase } from './application/use-cases/find-issues-by-project.use-case';
import { FindIssuesByEpicUseCase } from './application/use-cases/find-issues-by-epic.use-case';
import { FindIssueByIdUseCase } from './application/use-cases/find-issue-by-id.use-case';
import { UpdateIssueUseCase } from './application/use-cases/update-issue.use-case';
import { DeleteIssueUseCase } from './application/use-cases/delete-issue.use-case';
import { MoveIssueUseCase } from './application/use-cases/move-issue.use-case';
import { ProjectsModule } from '../projects/projects.module';
import { EpicsModule } from '../epics/epics.module';

@Module({
  imports: [TypeOrmModule.forFeature([Issue]), ProjectsModule, EpicsModule],
  controllers: [IssuesController],
  providers: [
    {
      provide: IssueRepository,
      useClass: TypeOrmIssueRepository,
    },
    CreateStoryUseCase,
    CreateBugUseCase,
    FindIssuesByProjectUseCase,
    FindIssuesByEpicUseCase,
    FindIssueByIdUseCase,
    UpdateIssueUseCase,
    DeleteIssueUseCase,
    MoveIssueUseCase,
  ],
  exports: [IssueRepository],
})
export class IssuesModule {}
