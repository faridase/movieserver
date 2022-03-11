import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { getRepository, Repository } from 'typeorm';
import { VoteDto } from './dto/vote.dto';
import { Vote } from './entities/vote.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  async vote(id: number, user: any): Promise<Vote> {
    const vote = new VoteDto();
    vote.user_id = user.id;
    vote.movie_id = id;
    const created = this.voteRepository.create(vote);
    const voted = await this.voteRepository.save(created);
    return created;
  }

  async unvote(id: number, user: any): Promise<number> {
    const vote = new VoteDto();
    vote.voted = false;
    const update = await this.voteRepository.update(
      { movie_id: id, user_id: user.id },
      vote,
    );
    return update.affected;
  }

  async getAll(id: number): Promise<any> {
    const [result, total] = await this.voteRepository.findAndCount({
      where: { user_id: id, voted: true },
      join: {
        alias: 'vote',
        leftJoinAndSelect: {
          action: 'vote.movie',
        },
      },
      select: ['movie'],
    });
    return {
      data: result,
      total: total,
    };
  }

  async getMostVoted(): Promise<any> {
    const query = await getRepository(Vote)
      .createQueryBuilder('vote')
      .groupBy('movie_id')
      .select('SUM(voted)', 'ttlvote')
      .orderBy('ttlvote', 'DESC')
      .limit(1)
      .innerJoinAndSelect('vote.movie', 'movie')
      .getRawMany();
    return query;
  }
}
