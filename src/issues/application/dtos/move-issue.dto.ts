import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IssueStatus } from '../../domain/issue.entity';

export class MoveIssueDto {
  @IsEnum(IssueStatus)
  status: IssueStatus;

  @IsOptional()
  @IsUUID()
  prevIssueId?: string;

  @IsOptional()
  @IsUUID()
  nextIssueId?: string;
}
