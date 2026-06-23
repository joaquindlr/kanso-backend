import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { IssueSeverity, IssueStatus } from '../../domain/issue.entity';

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsEnum(IssueSeverity)
  @IsOptional()
  severity?: IssueSeverity = IssueSeverity.MEDIUM;

  @IsString()
  @IsOptional()
  position?: string;

  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus = IssueStatus.NEW;

  @IsUUID()
  @IsOptional()
  epicId?: string;
}
