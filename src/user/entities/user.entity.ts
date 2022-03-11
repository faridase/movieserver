import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  isActive: boolean;
}
