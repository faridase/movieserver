import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, Like } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ResultMovieDto } from './dto/result-movies.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { SearchMovieDto } from './dto/search-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = await this.moviesRepository.create(createMovieDto);
    await this.moviesRepository.save(movie);
    return movie;
  }

  async findAll(
    page: number,
    limit: number,
    searchMovieDto: SearchMovieDto,
  ): Promise<ResultMovieDto> {
    const skip = (page - 1) * limit;
    const keyword = searchMovieDto.keyword || '';
    const [result, total] = await this.moviesRepository.findAndCount({
      where: [
        { title: Like('%' + keyword + '%') },
        { artist: Like('%' + keyword + '%') },
        { genre: Like('%' + keyword + '%') },
        { description: Like('%' + keyword + '%') },
      ],
      take: limit,
      skip: skip,
    });
    return {
      data: result,
      page_total: Math.ceil(total / limit),
      filtered: result.length,
      total: total,
    };
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne(id);
    if (movie) {
      return movie;
    } else {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    await this.moviesRepository.update(id, updateMovieDto);
    const movie = await this.moviesRepository.findOne(id);
    if (movie) {
      return movie;
    }
    throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleteResponse = await this.moviesRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    } else {
      return 'Deleted ' + deleteResponse.affected;
    }
  }

  async viewMovie(id: string) {
    const Id = parseInt(id);
    const response = await this.moviesRepository.increment(
      { id: Id },
      'views',
      1,
    );
    if (!response.affected) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    } else {
      return response.affected;
    }
  }

  async findMostViewed(): Promise<Movie[]> {
    return await this.moviesRepository.find({
      order: { views: 'DESC' },
      take: 1,
    });
  }

  async findMostViewedByGenre(): Promise<any[]> {
    const query = await getRepository(Movie)
      .createQueryBuilder('movie')
      .groupBy('genre')
      .select('SUM(views)', 'viewed')
      .addSelect('genre')
      .orderBy('viewed', 'DESC')
      .getRawMany();
    return query;
  }
}
