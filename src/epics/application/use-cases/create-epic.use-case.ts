import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { EpicRepository } from '../../domain/epic.repository';
import { ProjectRepository } from '../../../projects/domain/project.repository';
import { CreateEpicDto } from '../dtos/create-epic.dto';

@Injectable()
export class CreateEpicUseCase {
  constructor(
    private readonly epicRepository: EpicRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, projectId: string, dto: CreateEpicDto) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not own this project');
    }

    return this.epicRepository.create({
      ...dto,
      projectId,
    });
  }
}
