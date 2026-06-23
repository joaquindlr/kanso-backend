import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../domain/project.repository';
import { CreateProjectDto } from '../dtos/create-project.dto';

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(userId: string, dto: CreateProjectDto) {
    const prefix = this.generatePrefix(dto.name);

    return this.projectRepository.create({
      ...dto,
      userId,
      prefix,
    });
  }

  private generatePrefix(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length > 1) {
      return words.map((w) => w[0]).join('').toUpperCase().substring(0, 4);
    }
    return name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 4);
  }
}
