import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentRepository } from '../../domain/comment.repository';
import { IssueRepository } from '../../../issues/domain/issue.repository';
import { ProjectRepository } from '../../../projects/domain/project.repository';

@Injectable()
export class FindCommentsByIssueUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly issueRepository: IssueRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, issueId: string) {
    const issue = await this.issueRepository.findById(issueId);

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    const project = await this.projectRepository.findById(issue.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not own this project');
    }

    return this.commentRepository.findByIssueId(issueId);
  }
}
