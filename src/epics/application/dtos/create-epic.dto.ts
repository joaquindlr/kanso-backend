import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEpicDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
