import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { UserId } from '../../../auth/infrastructure/decorators/user-id.decorator';
import { CreateCommentUseCase } from '../../application/use-cases/create-comment.use-case';
import { FindCommentsByIssueUseCase } from '../../application/use-cases/find-comments-by-issue.use-case';
import { CreateCommentDto } from '../../application/dtos/create-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('issues/:issueId/comments')
export class CommentsController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly findCommentsByIssueUseCase: FindCommentsByIssueUseCase,
  ) {}

  @Post()
  create(
    @UserId() userId: string,
    @Param('issueId') issueId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.createCommentUseCase.execute(userId, issueId, dto);
  }

  @Get()
  findByIssue(@UserId() userId: string, @Param('issueId') issueId: string) {
    return this.findCommentsByIssueUseCase.execute(userId, issueId);
  }
}
