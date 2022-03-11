/* eslint-disable prettier/prettier */
import { Movie } from 'src/movie/entities/movie.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movie_id: number;

  @Column()
  user_id: number;

  @Column({ default: true })
  voted: boolean;
  
  @ManyToOne(type => Movie)
  @JoinColumn({name: 'movie_id', referencedColumnName:'id'})
  movie: Movie;
}
