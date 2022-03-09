/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { ResultMovieDto } from './dto/result-movies.dto';
import { SearchMovieDto } from './dto/search-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('add')
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.movieService.create(createMovieDto);
  }

  @Post(':page/:limit')
  find(@Body() searchMovieDTO: SearchMovieDto, @Param('page') page: string, @Param('limit') limit: string): Promise<ResultMovieDto> {
    return this.movieService.findAll(+page, +limit, searchMovieDTO);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Movie> {
    return this.movieService.findOne(+id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto): Promise<Movie> {
    return await this.movieService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(+id);
  }

  @Put('view/:id')
  async viewMovie(@Param('id') id: string) {
    return await this.movieService.viewMovie(id);
  }

  @Get('most/viewed')
  mostViewed(): Promise<Movie[]> {
    return this.movieService.findMostViewed();
  }

  @Get('most/viewed/genre')
  mostViewedByGenre(): Promise<any[]> {
    return this.movieService.findMostViewedByGenre();
  }


}
