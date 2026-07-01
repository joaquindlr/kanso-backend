import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './domain/project.entity';
import { ProjectRepository } from './domain/project.repository';
import { TypeOrmProjectRepository } from './infrastructure/persistence/typeorm-project.repository';
import { ProjectsController } from './infrastructure/controllers/projects.controller';
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';
import { FindProjectsUseCase } from './application/use-cases/find-projects.use-case';
import { FindProjectByIdUseCase } from './application/use-cases/find-project-by-id.use-case';
import { UpdateProjectUseCase } from './application/use-cases/update-project.use-case';
import { DeleteProjectUseCase } from './application/use-cases/delete-project.use-case';
import { UpdateProjectWhiteboardUseCase } from './application/use-cases/update-project-whiteboard.use-case';
import { StorageModule } from '../infrastructure/storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), StorageModule],
  controllers: [ProjectsController],
  providers: [
    {
      provide: ProjectRepository,
      useClass: TypeOrmProjectRepository,
    },
    CreateProjectUseCase,
    FindProjectsUseCase,
    FindProjectByIdUseCase,
    UpdateProjectUseCase,
    UpdateProjectWhiteboardUseCase,
    DeleteProjectUseCase,
  ],
  exports: [ProjectRepository],
})
export class ProjectsModule {}
