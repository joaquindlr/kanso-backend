import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Epic } from '../../domain/epic.entity';
import { EpicRepository } from '../../domain/epic.repository';

@Injectable()
export class TypeOrmEpicRepository implements EpicRepository {
  constructor(
    @InjectRepository(Epic)
    private readonly repository: Repository<Epic>,
  ) {}

  async findAll(): Promise<Epic[]> {
    return this.repository.find({ relations: ['project'] });
  }

  async findById(id: string): Promise<Epic | null> {
    return this.repository.findOne({ where: { id }, relations: ['project'] });
  }

  async create(epic: Partial<Epic>): Promise<Epic> {
    const newEpic = this.repository.create(epic);
    return this.repository.save(newEpic);
  }

  async update(id: string, epic: Partial<Epic>): Promise<Epic | null> {
    await this.repository.update(id, epic);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
