import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { CurrentUser } from '../auth/constants/current.user';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import { User } from '../user/entities/user.entity';
import { Vote } from './entities/vote.entity';
import { VoteService } from './vote.service';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async voteMovie(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<Vote> {
    return await this.voteService.vote(+id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('unvote/:id')
  async unvoteMovie(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<number> {
    return await this.voteService.unvote(+id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list/voted/movie')
  async getAll(@CurrentUser() user: User): Promise<any> {
    return await this.voteService.getAll(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('most/voted')
  @SetMetadata('roles', ['admin'])
  async getMostVoted(): Promise<any> {
    return await this.voteService.getMostVoted();
  }
}
