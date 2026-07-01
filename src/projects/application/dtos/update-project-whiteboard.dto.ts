import { IsNotEmpty } from 'class-validator';
import { ExcalidrawWhiteboardData } from '../../domain/whiteboard-data.interface';

export class UpdateProjectWhiteboardDto {
  @IsNotEmpty()
  excalidrawData!: ExcalidrawWhiteboardData;
}
