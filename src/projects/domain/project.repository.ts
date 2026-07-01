import { Project } from './project.entity';
import { ExcalidrawWhiteboardData } from './whiteboard-data.interface';

export abstract class ProjectRepository {
  abstract findAll(): Promise<Project[]>;
  abstract findById(id: string): Promise<Project | null>;
  abstract findByUserId(userId: string): Promise<Project[]>;
  abstract create(project: Partial<Project>): Promise<Project>;
  abstract update(
    id: string,
    project: Partial<Project>,
  ): Promise<Project | null>;
  abstract updateWhiteboardData(
    id: string,
    data: ExcalidrawWhiteboardData,
  ): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
