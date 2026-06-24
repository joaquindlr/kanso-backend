import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../domain/comment.entity';
import { CommentRepository } from '../../domain/comment.repository';

@Injectable()
export class TypeOrmCommentRepository implements CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}

  async create(comment: Partial<Comment>): Promise<Comment> {
    const newComment = this.repository.create(comment);
    return this.repository.save(newComment);
  }

  async findByIssueId(issueId: string): Promise<Comment[]> {
    return this.repository.find({
      where: { issueId },
      relations: ['user'],
      select: {
        id: true,
        content: true,
        issueId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          email: true,
        },
      },
      order: { createdAt: 'ASC' },
    });
  }
}
