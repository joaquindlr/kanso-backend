import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { UserId } from '../../../auth/infrastructure/decorators/user-id.decorator';
import { CreateStoryUseCase } from '../../application/use-cases/create-story.use-case';
import { CreateBugUseCase } from '../../application/use-cases/create-bug.use-case';
import { FindIssuesByProjectUseCase } from '../../application/use-cases/find-issues-by-project.use-case';
import { FindIssuesByEpicUseCase } from '../../application/use-cases/find-issues-by-epic.use-case';
import { FindIssueByIdUseCase } from '../../application/use-cases/find-issue-by-id.use-case';
import { UpdateIssueUseCase } from '../../application/use-cases/update-issue.use-case';
import { DeleteIssueUseCase } from '../../application/use-cases/delete-issue.use-case';
import { MoveIssueUseCase } from '../../application/use-cases/move-issue.use-case';
import { CreateStoryDto } from '../../application/dtos/create-story.dto';
import { CreateBugDto } from '../../application/dtos/create-bug.dto';
import { UpdateIssueDto } from '../../application/dtos/update-issue.dto';
import { MoveIssueDto } from '../../application/dtos/move-issue.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class IssuesController {
  constructor(
    private readonly createStoryUseCase: CreateStoryUseCase,
    private readonly createBugUseCase: CreateBugUseCase,
    private readonly findIssuesByProjectUseCase: FindIssuesByProjectUseCase,
    private readonly findIssuesByEpicUseCase: FindIssuesByEpicUseCase,
    private readonly findIssueByIdUseCase: FindIssueByIdUseCase,
    private readonly updateIssueUseCase: UpdateIssueUseCase,
    private readonly deleteIssueUseCase: DeleteIssueUseCase,
    private readonly moveIssueUseCase: MoveIssueUseCase,
  ) {}

  @Post('projects/:projectId/stories')
  createStory(
    @UserId() userId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateStoryDto,
  ) {
    return this.createStoryUseCase.execute(userId, projectId, dto);
  }

  @Post('projects/:projectId/bugs')
  createBug(
    @UserId() userId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateBugDto,
  ) {
    return this.createBugUseCase.execute(userId, projectId, dto);
  }

  @Get('projects/:projectId/issues')
  findByProject(
    @UserId() userId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.findIssuesByProjectUseCase.execute(userId, projectId);
  }

  @Get('epics/:epicId/issues')
  findByEpic(@UserId() userId: string, @Param('epicId') epicId: string) {
    return this.findIssuesByEpicUseCase.execute(userId, epicId);
  }

  @Get('issues/:id')
  findOne(@UserId() userId: string, @Param('id') id: string) {
    return this.findIssueByIdUseCase.execute(userId, id);
  }

  @Patch('issues/:id')
  update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateIssueDto,
  ) {
    return this.updateIssueUseCase.execute(userId, id, dto);
  }

  @Delete('issues/:id')
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.deleteIssueUseCase.execute(userId, id);
  }

  @Patch('issues/:id/move')
  move(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() dto: MoveIssueDto,
  ) {
    return this.moveIssueUseCase.execute(userId, id, dto);
  }
}
