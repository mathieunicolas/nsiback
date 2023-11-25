import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  author: User;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  master: number;

  @Column({ default: true })
  isShareable: boolean;
}
