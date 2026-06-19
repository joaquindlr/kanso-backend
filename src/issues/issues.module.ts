import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './domain/issue.entity';
import { IssueRepository } from './domain/issue.repository';
import { TypeOrmIssueRepository } from './infrastructure/persistence/typeorm-issue.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Issue])],
  controllers: [],
  providers: [
    {
      provide: IssueRepository,
      useClass: TypeOrmIssueRepository,
    },
  ],
  exports: [IssueRepository],
})
export class IssuesModule {}
