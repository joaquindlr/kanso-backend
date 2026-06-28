import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IssueRepository } from '../../domain/issue.repository';
import { EpicRepository } from '../../../epics/domain/epic.repository';
import { ProjectRepository } from '../../../projects/domain/project.repository';
import { CreateStoryDto } from '../dtos/create-story.dto';
import { IssueType, IssueStatus } from '../../domain/issue.entity';
import { LexoRank } from 'lexorank';

@Injectable()
export class CreateStoryUseCase {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly epicRepository: EpicRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, projectId: string, dto: CreateStoryDto) {
    const project = await this.projectRepository.findById(projectId);

    if (!project || project.userId !== userId) {
      throw new ForbiddenException('You do not own this project');
    }

    if (dto.epicId) {
      const epic = await this.epicRepository.findById(dto.epicId);
      if (!epic || epic.projectId !== projectId) {
        throw new NotFoundException('Epic not found in this project');
      }
    }

    let position = dto.position;
    if (!position) {
      const lastIssue = await this.issueRepository.findLastIssueByStatus(projectId, dto.status || IssueStatus.NEW);
      if (lastIssue && lastIssue.position) {
        position = LexoRank.parse(lastIssue.position).genNext().toString();
      } else {
        position = LexoRank.middle().toString();
      }
    }

    // Increment project issue sequence
    project.issueSequence += 1;
    await this.projectRepository.update(project.id, { issueSequence: project.issueSequence });
    const key = `${project.prefix}-${project.issueSequence}`;

    return this.issueRepository.create({
      ...dto,
      epicId: dto.epicId || undefined,
      projectId,
      type: IssueType.STORY,
      position,
      key,
    });
  }
}
