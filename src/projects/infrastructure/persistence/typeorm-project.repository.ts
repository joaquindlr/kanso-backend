import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../domain/project.entity';
import { ProjectRepository } from '../../domain/project.repository';
import { ExcalidrawWhiteboardData } from '../../domain/whiteboard-data.interface';

@Injectable()
export class TypeOrmProjectRepository implements ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.repository.find({ relations: ['user'] });
  }

  async findByUserId(userId: string): Promise<Project[]> {
    return this.repository
      .createQueryBuilder('project')
      .where('project.userId = :userId', { userId })
      .loadRelationCountAndMap('project.totalTasks', 'project.issues')
      .loadRelationCountAndMap(
        'project.completedTasks',
        'project.issues',
        'issue',
        (qb) => qb.where("issue.status IN ('DONE', 'DEPLOYED')"),
      )
      .getMany();
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

  async updateWhiteboardData(
    id: string,
    data: ExcalidrawWhiteboardData,
  ): Promise<void> {
    console.log('data: ', data);
    await this.repository.update(id, { excalidrawData: data });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
