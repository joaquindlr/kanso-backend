import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from './domain/epic.entity';
import { EpicRepository } from './domain/epic.repository';
import { TypeOrmEpicRepository } from './infrastructure/persistence/typeorm-epic.repository';
import { EpicsController } from './infrastructure/controllers/epics.controller';
import { CreateEpicUseCase } from './application/use-cases/create-epic.use-case';
import { FindEpicsByProjectUseCase } from './application/use-cases/find-epics-by-project.use-case';
import { FindEpicByIdUseCase } from './application/use-cases/find-epic-by-id.use-case';
import { UpdateEpicUseCase } from './application/use-cases/update-epic.use-case';
import { DeleteEpicUseCase } from './application/use-cases/delete-epic.use-case';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([Epic]), ProjectsModule],
  controllers: [EpicsController],
  providers: [
    {
      provide: EpicRepository,
      useClass: TypeOrmEpicRepository,
    },
    CreateEpicUseCase,
    FindEpicsByProjectUseCase,
    FindEpicByIdUseCase,
    UpdateEpicUseCase,
    DeleteEpicUseCase,
  ],
  exports: [EpicRepository],
})
export class EpicsModule {}
