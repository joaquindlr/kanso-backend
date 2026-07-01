import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue, IssueStatus } from '../../domain/issue.entity';
import { IssueRepository } from '../../domain/issue.repository';

@Injectable()
export class TypeOrmIssueRepository implements IssueRepository {
  constructor(
    @InjectRepository(Issue)
    private readonly repository: Repository<Issue>,
  ) {}

  async findAll(): Promise<Issue[]> {
    return this.repository.find({ relations: ['project', 'epic'] });
  }

  async findByProjectId(projectId: string): Promise<Issue[]> {
    return this.repository.find({
      where: { projectId },
      relations: ['project', 'epic'],
    });
  }

  async findByEpicId(epicId: string): Promise<Issue[]> {
    return this.repository.find({ where: { epicId } });
  }

  async findById(id: string): Promise<Issue | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['project', 'epic'],
    });
  }

  async findLastIssueByStatus(
    projectId: string,
    status: string,
  ): Promise<Issue | null> {
    return this.repository.findOne({
      where: { projectId, status: status as IssueStatus },
      order: { position: 'DESC' },
    });
  }

  async create(issue: Partial<Issue>): Promise<Issue> {
    const newIssue = this.repository.create(issue);
    return this.repository.save(newIssue);
  }

  async update(id: string, issue: Partial<Issue>): Promise<Issue | null> {
    await this.repository.update(id, issue);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
