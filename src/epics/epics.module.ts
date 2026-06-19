import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from './domain/epic.entity';
import { EpicRepository } from './domain/epic.repository';
import { TypeOrmEpicRepository } from './infrastructure/persistence/typeorm-epic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Epic])],
  controllers: [],
  providers: [
    {
      provide: EpicRepository,
      useClass: TypeOrmEpicRepository,
    },
  ],
  exports: [EpicRepository],
})
export class EpicsModule {}
