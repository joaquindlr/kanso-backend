import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IssueRepository } from '../../domain/issue.repository';
import { ProjectRepository } from '../../../projects/domain/project.repository';

@Injectable()
export class FindIssueByIdUseCase {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, issueId: string) {
    const issue = await this.issueRepository.findById(issueId);

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    const project = await this.projectRepository.findById(issue.projectId);

    if (!project || project.userId !== userId) {
      throw new ForbiddenException('You do not own the project of this issue');
    }

    return issue;
  }
}
