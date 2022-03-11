import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UserService {
  private saltRounds: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.saltRounds = 10;
  }

  async findByEmail(email: string): Promise<boolean> {
    const check = await this.userRepository.findOne({ email: email });
    if (check) {
      return true;
    }
    return false;
  }

  async create(createUserDto: CreateUserDto): Promise<AuthDto> {
    createUserDto.password = await this.getHash(createUserDto.password);
    const created = await this.userRepository.save(
      this.userRepository.create(createUserDto),
    );
    const result = {
      email: created.email,
      password: created.password,
    };
    return result;
  }

  async getHash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async findByEmailWithPassword(email: string): Promise<User> | null {
    const result = await this.userRepository.findOne(
      { email: email },
      { select: ['id', 'email', 'password', 'role'] },
    );
    return result;
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id: id });
  }
}
