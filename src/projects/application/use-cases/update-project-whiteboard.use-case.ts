import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from '../../domain/project.repository';
import { UpdateProjectWhiteboardDto } from '../dtos/update-project-whiteboard.dto';

@Injectable()
export class UpdateProjectWhiteboardUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(
    userId: string,
    projectId: string,
    dto: UpdateProjectWhiteboardDto,
  ): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.updateWhiteboardData(
      projectId,
      dto.excalidrawData,
    );
  }
}
