/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, SetMetadata, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { ResultMovieDto } from './dto/result-movies.dto';
import { SearchMovieDto } from './dto/search-movie.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import { RolesGuard } from '../auth/guards/roles.guards';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('add')
  @SetMetadata('roles', ['admin'])
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.movieService.create(createMovieDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':page/:limit')
  find(@Body() searchMovieDTO: SearchMovieDto, @Param('page') page: string, @Param('limit') limit: string): Promise<ResultMovieDto> {
    return this.movieService.findAll(+page, +limit, searchMovieDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Movie> {
    return this.movieService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update/:id')
  @SetMetadata('roles', ['admin'])
  async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto): Promise<Movie> {
    return await this.movieService.update(+id, updateMovieDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @SetMetadata('roles', ['admin'])
  remove(@Param('id') id: string) {
    return this.movieService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('view/:id')
  async viewMovie(@Param('id') id: string) {
    return await this.movieService.viewMovie(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('most/viewed') 
  @SetMetadata('roles', ['admin'])
  mostViewed(): Promise<Movie[]> {
    return this.movieService.findMostViewed();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('most/viewed/genre')
  @SetMetadata('roles', ['admin'])
  mostViewedByGenre(): Promise<any[]> {
    return this.movieService.findMostViewedByGenre();
  }

}
