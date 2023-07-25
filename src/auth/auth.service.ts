import { RegisterUserDto } from './../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    if (!user) return null;

    const isValPass = await bcrypt.compare(pass, user.password);
    return isValPass ? user : null;
  }

  async compareToken(user: IUser) {
    const payload = {
      sub: 'Token Login',
      iss: 'From Server',
      _id: user._id,
      email: user.email,
      name: user.name,
      address: user.address,
      age: user.age,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      ...payload,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.register(registerUserDto);
    return {
      _id: user._id,
      createdAt: user.createdAt,
    };
  }
}
