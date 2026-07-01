import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IssueRepository } from '../../domain/issue.repository';
import { ProjectRepository } from '../../../projects/domain/project.repository';
import { CreateBugDto } from '../dtos/create-bug.dto';
import { IssueType, IssueStatus } from '../../domain/issue.entity';
import { LexoRank } from 'lexorank';

@Injectable()
export class CreateBugUseCase {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, projectId: string, dto: CreateBugDto) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not own this project');
    }

    let position = dto.position;
    if (!position) {
      const lastIssue = await this.issueRepository.findLastIssueByStatus(
        projectId,
        IssueStatus.NEW,
      );
      if (lastIssue && lastIssue.position) {
        position = LexoRank.parse(lastIssue.position).genNext().toString();
      } else {
        position = LexoRank.middle().toString();
      }
    }

    // Increment project issue sequence
    project.issueSequence += 1;
    await this.projectRepository.update(project.id, {
      issueSequence: project.issueSequence,
    });
    const key = `${project.prefix}-${project.issueSequence}`;

    return this.issueRepository.create({
      ...dto,
      projectId,
      type: IssueType.BUG,
      position,
      key,
    });
  }
}
