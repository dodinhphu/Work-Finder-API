import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponeMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponeMessage('Tạo Mới User Thành Công!')
  create(@Body() createUserDto: CreateUserDto, @User() userLogin: IUser) {
    return this.usersService.create(createUserDto, userLogin);
  }

  @Get(':email')
  @ResponeMessage('Thông Tin User!')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Get()
  @ResponeMessage('List User!')
  findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+page, +limit, qs);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @User() userLogin: IUser) {
    return this.usersService.update(updateUserDto, userLogin);
  }

  @Delete(':email')
  @ResponeMessage('Xóa User!')
  remove(@Param('email') email: string, @User() userLogin: IUser) {
    return this.usersService.remove(email, userLogin);
  }
}
