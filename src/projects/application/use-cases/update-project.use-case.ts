import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from '../../domain/project.repository';
import { UpdateProjectDto } from '../dtos/update-project.dto';

@Injectable()
export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(userId: string, projectId: string, dto: UpdateProjectDto) {
    const project = await this.projectRepository.findById(projectId);

    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    return this.projectRepository.update(projectId, dto);
  }
}
