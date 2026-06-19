import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './domain/project.entity';
import { ProjectRepository } from './domain/project.repository';
import { TypeOrmProjectRepository } from './infrastructure/persistence/typeorm-project.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [],
  providers: [
    {
      provide: ProjectRepository,
      useClass: TypeOrmProjectRepository,
    },
  ],
  exports: [ProjectRepository],
})
export class ProjectsModule {}
