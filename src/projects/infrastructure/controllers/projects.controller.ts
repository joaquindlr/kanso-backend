import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
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
import { S3Service } from '../../../infrastructure/storage/s3.service';

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
    private readonly s3Service: S3Service,
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

  @Get(':id/files/:fileId')
  async getFile(
    @UserId() userId: string,
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    await this.findProjectByIdUseCase.execute(userId, id);

    const s3Key = `projects/${id}/files/${fileId}`;
    const url = await this.s3Service.getPresignedUrl(s3Key);

    return res.redirect(302, url);
  }
}
