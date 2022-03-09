/* eslint-disable prettier/prettier */

import { Movie } from "../entities/movie.entity";

export class ResultMovieDto {
  data: Movie[];
  total: number;
}
