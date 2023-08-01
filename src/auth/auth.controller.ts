import { User } from './../decorator/customize';
import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponeMessage } from '../decorator/customize';
import { LocalAuthGuard } from './constant.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.compareToken(req.user, res);
  }

  @Public()
  @ResponeMessage('User Mới đã được đăng ký')
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponeMessage('Thông tin User')
  @Get('account')
  async getUserInfo(@User() user: IUser) {
    return { user };
  }
}
