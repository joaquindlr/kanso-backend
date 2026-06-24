import { Comment } from './comment.entity';

export abstract class CommentRepository {
  abstract create(comment: Partial<Comment>): Promise<Comment>;
  abstract findByIssueId(issueId: string): Promise<Comment[]>;
}
