import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  body: string;

  @Column()
  author: string;

  @Column({ default: false })
  pinned: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
