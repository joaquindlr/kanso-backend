import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { LexoRank } from 'lexorank';
import { IssueRepository } from '../../domain/issue.repository';
import { ProjectRepository } from '../../../projects/domain/project.repository';
import { MoveIssueDto } from '../dtos/move-issue.dto';

@Injectable()
export class MoveIssueUseCase {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, issueId: string, dto: MoveIssueDto) {
    const issue = await this.issueRepository.findById(issueId);

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    const project = await this.projectRepository.findById(issue.projectId);

    if (!project || project.userId !== userId) {
      throw new ForbiddenException('You do not own the project of this issue');
    }

    let newLexoRank: LexoRank;

    if (dto.prevIssueId && dto.nextIssueId) {
      const prevIssue = await this.issueRepository.findById(dto.prevIssueId);
      const nextIssue = await this.issueRepository.findById(dto.nextIssueId);

      if (!prevIssue || !nextIssue) {
        throw new BadRequestException('Invalid prevIssueId or nextIssueId');
      }

      const prevRank = LexoRank.parse(
        prevIssue.position || LexoRank.middle().toString(),
      );
      const nextRank = LexoRank.parse(
        nextIssue.position || LexoRank.middle().toString(),
      );
      newLexoRank = prevRank.between(nextRank);
    } else if (dto.prevIssueId) {
      const prevIssue = await this.issueRepository.findById(dto.prevIssueId);
      if (!prevIssue) {
        throw new BadRequestException('Invalid prevIssueId');
      }
      const prevRank = LexoRank.parse(
        prevIssue.position || LexoRank.middle().toString(),
      );
      newLexoRank = prevRank.genNext();
    } else if (dto.nextIssueId) {
      const nextIssue = await this.issueRepository.findById(dto.nextIssueId);
      if (!nextIssue) {
        throw new BadRequestException('Invalid nextIssueId');
      }
      const nextRank = LexoRank.parse(
        nextIssue.position || LexoRank.middle().toString(),
      );
      newLexoRank = nextRank.genPrev();
    } else {
      const lastIssue = await this.issueRepository.findLastIssueByStatus(
        issue.projectId,
        dto.status,
      );
      if (lastIssue && lastIssue.position) {
        const lastRank = LexoRank.parse(lastIssue.position);
        newLexoRank = lastRank.genNext();
      } else {
        newLexoRank = LexoRank.middle();
      }
    }

    return this.issueRepository.update(issueId, {
      status: dto.status,
      position: newLexoRank.toString(),
    });
  }
}
