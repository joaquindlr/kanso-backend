import { IsNotEmpty } from 'class-validator';

export class UpdateProjectWhiteboardDto {
  @IsNotEmpty()
  excalidrawData: any;
}
