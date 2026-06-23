import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { IssueSeverity, IssueStatus } from '../../domain/issue.entity';

export class CreateBugDto {
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
}
