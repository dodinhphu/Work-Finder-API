import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) return null;

    const isValPass = await bcrypt.compare(pass, user.password);
    return isValPass ? user : null;
  }

  async compareToken(user: CreateUserDto) {
    const payload = {
      email: user.email,
      name: user.name,
      address: user.address,
      age: user.age,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
