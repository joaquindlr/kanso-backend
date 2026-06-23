import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/domain/project.entity';
import { Epic } from '../../epics/domain/epic.entity';

export enum IssueType {
  STORY = 'STORY',
  BUG = 'BUG',
}

export enum IssueStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  DEPLOYED = 'DEPLOYED',
}

export enum IssueSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.issues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId: string;

  @ManyToOne(() => Epic, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'epic_id' })
  epic: Epic;

  @Column({ type: 'uuid', name: 'epic_id', nullable: true })
  epicId: string;

  @Column({ type: 'varchar', length: 20 })
  key: string;

  @Column({ type: 'enum', enum: IssueType })
  type: IssueType;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ type: 'enum', enum: IssueStatus, default: IssueStatus.NEW })
  status: IssueStatus;

  @Column({ type: 'varchar', length: 255 })
  position: string;

  @Column({ type: 'enum', enum: IssueSeverity, default: IssueSeverity.MEDIUM })
  severity: IssueSeverity;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
