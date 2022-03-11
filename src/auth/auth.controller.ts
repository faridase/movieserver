import {
  Controller,
  Post,
  Body,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto): Promise<any> {
    const emailExist = await this.userService.findByEmail(userDto.email);

    if (emailExist) {
      throw new UnprocessableEntityException();
    }
    const createuser = await this.userService.create(userDto);
    return this.authService.authenticate(createuser);
  }

  @Post('register/admin')
  async registerAsAdmin(@Body() userDto: CreateUserDto): Promise<any> {
    const emailExist = await this.userService.findByEmail(userDto.email);

    if (emailExist) {
      throw new UnprocessableEntityException();
    }
    userDto.role = 'admin';
    const createuser = await this.userService.create(userDto);
    return this.authService.authenticate(createuser);
  }

  @Post('login')
  async login(@Body() authDto: AuthDto): Promise<any> {
    return this.authService.authenticate(authDto);
  }
}
