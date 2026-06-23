import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { EpicRepository } from '../../domain/epic.repository';
import { ProjectRepository } from '../../../projects/domain/project.repository';

@Injectable()
export class FindEpicsByProjectUseCase {
  constructor(
    private readonly epicRepository: EpicRepository,
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

    return this.epicRepository.findByProjectId(projectId);
  }
}
