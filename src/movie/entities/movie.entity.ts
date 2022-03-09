import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  duration: number;

  @Column()
  artist: string;

  @Column()
  genre: string;

  @Column()
  url: string;

  @Column()
  views: number;
}
