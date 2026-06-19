import { Epic } from './epic.entity';

export abstract class EpicRepository {
  abstract findAll(): Promise<Epic[]>;
  abstract findById(id: string): Promise<Epic | null>;
  abstract create(epic: Partial<Epic>): Promise<Epic>;
  abstract update(id: string, epic: Partial<Epic>): Promise<Epic | null>;
  abstract delete(id: string): Promise<void>;
}
