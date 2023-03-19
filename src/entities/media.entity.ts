import { FileStatus } from 'src/util/global.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('medias')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  file_name: string;

  @Column()
  file_type: string;

  @Column({ type: 'text', nullable: false })
  url: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({
    type: 'enum',
    enum: FileStatus,
    default: FileStatus.INACTIVE,
    nullable: true,
  })
  status?: FileStatus;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @DeleteDateColumn()
  deleted_at: string;
}
