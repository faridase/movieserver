import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(auth: AuthDto): Promise<any> {
    const user = await this.userService.findByEmailWithPassword(auth.email);
    if (!user) {
      throw new BadRequestException();
    }

    if (!this.userService.compareHash(auth.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    return { access_token: this.jwtService.sign({ id: user.id }) };
  }

  async validateUser(payload: any): Promise<User> {
    return await this.userService.findById(payload.id);
  }
}
