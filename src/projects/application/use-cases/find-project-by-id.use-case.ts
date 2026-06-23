import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from '../../domain/project.repository';

@Injectable()
export class FindProjectByIdUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(userId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);

    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
