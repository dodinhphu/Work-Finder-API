import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  async findAll() {
    const listUser = await this.userModel.find({});
    return listUser;
  }

  async findOne(email: string) {
    const user = await this.userModel.findOne({
      email: email,
    });
    return user;
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const result = await this.userModel.updateOne(
      {
        email: email,
      },
      updateUserDto,
    );
    return result;
  }

  async remove(email: string) {
    const result = await this.userModel.deleteOne({
      email: email,
    });
    return result;
  }
}