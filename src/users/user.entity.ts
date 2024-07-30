import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastNAme: string;

  @Column()
  type: string;

  @Column()
  classes: string;

  @Column()
  bday: string;

  @Column()
  entId: string;

  @Column({ default: 0 })
  role: number;
}
