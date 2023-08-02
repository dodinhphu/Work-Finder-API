import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { IUser } from 'src/users/users.interface';
import { Response } from 'express';
import ms from 'ms';

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

  async login(user: IUser, res: Response) {
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
    // Update token in DB
    this.usersService.updateRefreshToken(refreshToken, user.email);
    // Set Cookies
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('REFRESH_TIME_OUT_TOKEN')),
    });
    return {
      access_token: this.jwtService.sign(payload),
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

  async handleRefreshToken(refreshToken: string) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
      const user = await this.usersService.getUserByRefreshToken(refreshToken);
      if (user) {
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
          user: {
            ...payload,
          },
        };
      } else {
        throw new BadRequestException('Refresh token không đúng !!!');
      }
    } catch (error) {
      throw new BadRequestException('Refresh token đã hết hạn !!!');
    }
  }
}
