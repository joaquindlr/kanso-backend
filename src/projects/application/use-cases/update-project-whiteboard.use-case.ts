import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProjectRepository } from '../../domain/project.repository';
import { UpdateProjectWhiteboardDto } from '../dtos/update-project-whiteboard.dto';
import { S3Service } from '../../../infrastructure/storage/s3.service';
@Injectable()
export class UpdateProjectWhiteboardUseCase {
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

    let updatedExcalidrawData: any = dto.excalidrawData;

    if (updatedExcalidrawData && updatedExcalidrawData.files) {
      for (const fileId of Object.keys(updatedExcalidrawData.files)) {
        const fileObj = updatedExcalidrawData.files[fileId];
        if (fileObj && fileObj.dataURL && fileObj.dataURL.startsWith('data:')) {
          // Extract base64 and mime type
          const matches = fileObj.dataURL.match(/^data:([a-zA-Z0-9-+/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            const s3Key = `projects/${projectId}/files/${fileId}`;
            
            await this.s3Service.uploadFile(s3Key, buffer, mimeType);
            
            const apiUrl = this.configService.get<string>('API_URL') || 'http://localhost:3000';
            fileObj.dataURL = `${apiUrl}/projects/${projectId}/files/${fileId}`;
          }
        }
      }
    }

    await this.projectRepository.updateWhiteboardData(
      projectId,
      updatedExcalidrawData,
    );
  }
}
