import { IsString, IsOptional } from 'class-validator';

export class UpdateEpicDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
