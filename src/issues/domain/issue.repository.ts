import { Issue } from './issue.entity';

export abstract class IssueRepository {
  abstract findAll(): Promise<Issue[]>;
  abstract findById(id: string): Promise<Issue | null>;
  abstract create(issue: Partial<Issue>): Promise<Issue>;
  abstract update(id: string, issue: Partial<Issue>): Promise<Issue | null>;
  abstract delete(id: string): Promise<void>;
}
