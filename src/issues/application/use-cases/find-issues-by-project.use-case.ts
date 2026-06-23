import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IssueRepository } from '../../domain/issue.repository';
import { ProjectRepository } from '../../../projects/domain/project.repository';

@Injectable()
export class FindIssuesByProjectUseCase {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not own this project');
    }

    return this.issueRepository.findByProjectId(projectId);
  }
}
