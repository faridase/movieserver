import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  title: string;
  description: string;
  duration: number;
  artist: string;
  genre: string;
  url: string;
}
