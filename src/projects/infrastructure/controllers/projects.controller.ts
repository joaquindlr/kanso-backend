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
import { CreateProjectUseCase } from '../../application/use-cases/create-project.use-case';
import { FindProjectsUseCase } from '../../application/use-cases/find-projects.use-case';
import { FindProjectByIdUseCase } from '../../application/use-cases/find-project-by-id.use-case';
import { UpdateProjectUseCase } from '../../application/use-cases/update-project.use-case';
import { DeleteProjectUseCase } from '../../application/use-cases/delete-project.use-case';
import { UpdateProjectWhiteboardUseCase } from '../../application/use-cases/update-project-whiteboard.use-case';
import { CreateProjectDto } from '../../application/dtos/create-project.dto';
import { UpdateProjectDto } from '../../application/dtos/update-project.dto';
import { UpdateProjectWhiteboardDto } from '../../application/dtos/update-project-whiteboard.dto';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly findProjectsUseCase: FindProjectsUseCase,
    private readonly findProjectByIdUseCase: FindProjectByIdUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly updateProjectWhiteboardUseCase: UpdateProjectWhiteboardUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
  ) {}

  @Post()
  create(@UserId() userId: string, @Body() dto: CreateProjectDto) {
    return this.createProjectUseCase.execute(userId, dto);
  }

  @Get()
  findAll(@UserId() userId: string) {
    return this.findProjectsUseCase.execute(userId);
  }

  @Get(':id')
  findOne(@UserId() userId: string, @Param('id') id: string) {
    return this.findProjectByIdUseCase.execute(userId, id);
  }

  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.updateProjectUseCase.execute(userId, id, dto);
  }

  @Patch(':id/whiteboard')
  updateWhiteboard(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProjectWhiteboardDto,
  ) {
    return this.updateProjectWhiteboardUseCase.execute(userId, id, dto);
  }

  @Delete(':id')
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.deleteProjectUseCase.execute(userId, id);
  }
}
