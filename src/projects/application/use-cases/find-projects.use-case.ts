import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../domain/project.repository';

@Injectable()
export class FindProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(userId: string) {
    return this.projectRepository.findByUserId(userId);
  }
}
