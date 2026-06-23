import { IsString, IsOptional, IsEnum } from 'class-validator';
import { IssueSeverity, IssueStatus } from '../../domain/issue.entity';

export class UpdateIssueDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsEnum(IssueSeverity)
  @IsOptional()
  severity?: IssueSeverity;

  @IsString()
  @IsOptional()
  position?: string;

  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;
}
