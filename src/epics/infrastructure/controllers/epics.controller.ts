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
import { CreateEpicUseCase } from '../../application/use-cases/create-epic.use-case';
import { FindEpicsByProjectUseCase } from '../../application/use-cases/find-epics-by-project.use-case';
import { FindEpicByIdUseCase } from '../../application/use-cases/find-epic-by-id.use-case';
import { UpdateEpicUseCase } from '../../application/use-cases/update-epic.use-case';
import { DeleteEpicUseCase } from '../../application/use-cases/delete-epic.use-case';
import { CreateEpicDto } from '../../application/dtos/create-epic.dto';
import { UpdateEpicDto } from '../../application/dtos/update-epic.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class EpicsController {
  constructor(
    private readonly createEpicUseCase: CreateEpicUseCase,
    private readonly findEpicsByProjectUseCase: FindEpicsByProjectUseCase,
    private readonly findEpicByIdUseCase: FindEpicByIdUseCase,
    private readonly updateEpicUseCase: UpdateEpicUseCase,
    private readonly deleteEpicUseCase: DeleteEpicUseCase,
  ) {}

  @Post('projects/:projectId/epics')
  create(
    @UserId() userId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateEpicDto,
  ) {
    return this.createEpicUseCase.execute(userId, projectId, dto);
  }

  @Get('projects/:projectId/epics')
  findByProject(
    @UserId() userId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.findEpicsByProjectUseCase.execute(userId, projectId);
  }

  @Get('epics/:id')
  findOne(@UserId() userId: string, @Param('id') id: string) {
    return this.findEpicByIdUseCase.execute(userId, id);
  }

  @Patch('epics/:id')
  update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEpicDto,
  ) {
    return this.updateEpicUseCase.execute(userId, id, dto);
  }

  @Delete('epics/:id')
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.deleteEpicUseCase.execute(userId, id);
  }
}
