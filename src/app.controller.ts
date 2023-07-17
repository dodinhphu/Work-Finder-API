import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/constant.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/constant.metadata';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.compareToken(req.user);
  }
}
