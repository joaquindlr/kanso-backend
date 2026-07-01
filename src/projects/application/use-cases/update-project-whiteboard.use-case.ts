import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProjectRepository } from '../../domain/project.repository';
import { UpdateProjectWhiteboardDto } from '../dtos/update-project-whiteboard.dto';
import { S3Service } from '../../../infrastructure/storage/s3.service';
import { ExcalidrawWhiteboardData } from '../../domain/whiteboard-data.interface';
@Injectable()
export class UpdateProjectWhiteboardUseCase {
  private readonly logger = new Logger(UpdateProjectWhiteboardUseCase.name);

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    userId: string,
    projectId: string,
    dto: UpdateProjectWhiteboardDto,
  ): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    const updatedExcalidrawData: ExcalidrawWhiteboardData = dto.excalidrawData;

    if (updatedExcalidrawData && updatedExcalidrawData.files) {
      for (const fileId of Object.keys(updatedExcalidrawData.files)) {
        const fileObj = updatedExcalidrawData.files[fileId];

        if (fileObj && fileObj.dataURL && fileObj.dataURL.startsWith('data:')) {
          const matches = fileObj.dataURL.match(/^data:(.*?)(;base64)?,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const isBase64 = !!matches[2];
            const data = matches[3];

            let buffer: Buffer;
            if (isBase64) {
              buffer = Buffer.from(data, 'base64');
            } else {
              buffer = Buffer.from(decodeURIComponent(data), 'utf-8');
            }
            const s3Key = `projects/${projectId}/files/${fileId}`;

            await this.s3Service.uploadFile(s3Key, buffer, mimeType);

            const apiUrl =
              this.configService.get<string>('API_URL') ||
              'http://localhost:3000';
            fileObj.dataURL = `${apiUrl}/projects/${projectId}/files/${fileId}`;
          } else {
            this.logger.warn(
              `File ${fileId} started with data: but failed regex match`,
            );
          }
        } else {
          this.logger.log(`File ${fileId} did not start with data:`);
        }
      }
    }

    await this.projectRepository.updateWhiteboardData(
      projectId,
      updatedExcalidrawData,
    );
  }
}
