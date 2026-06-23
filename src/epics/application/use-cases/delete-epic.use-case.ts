import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { EpicRepository } from '../../domain/epic.repository';
import { ProjectRepository } from '../../../projects/domain/project.repository';

@Injectable()
export class DeleteEpicUseCase {
  constructor(
    private readonly epicRepository: EpicRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, epicId: string) {
    const epic = await this.epicRepository.findById(epicId);

    if (!epic) {
      throw new NotFoundException('Epic not found');
    }

    const project = await this.projectRepository.findById(epic.projectId);

    if (!project || project.userId !== userId) {
      throw new ForbiddenException('You do not own the project of this epic');
    }

    await this.epicRepository.delete(epicId);
  }
}
