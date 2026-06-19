import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../domain/project.entity';
import { ProjectRepository } from '../../domain/project.repository';

@Injectable()
export class TypeOrmProjectRepository implements ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.repository.find({ relations: ['user'] });
  }

  async findById(id: string): Promise<Project | null> {
    return this.repository.findOne({ where: { id }, relations: ['user'] });
  }

  async create(project: Partial<Project>): Promise<Project> {
    const newProject = this.repository.create(project);
    return this.repository.save(newProject);
  }

  async update(id: string, project: Partial<Project>): Promise<Project | null> {
    await this.repository.update(id, project);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
