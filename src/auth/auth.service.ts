import { ConfigService } from '@nestjs/config';
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
    private configService: ConfigService,
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
    const refreshToken = this.createRefreshToken(payload);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        ...payload,
      },
    };
  }

  createRefreshToken(payload: object) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TIME_OUT_TOKEN'),
    });
    return refreshToken;
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.register(registerUserDto);
    return {
      _id: user._id,
      createdAt: user.createdAt,
    };
  }
}
