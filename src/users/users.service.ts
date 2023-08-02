import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserMode, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { IUser } from './users.interface';
import { User as UserDecorator } from 'src/decorator/customize';
import { role } from './constant/role';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserMode.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    @UserDecorator() userLogin: IUser,
  ) {
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    const isVal = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isVal) {
      throw new BadRequestException(
        `Email ${createUserDto.email} đã được đăng ký trên hệ thống!!!`,
      );
    }

    const user = await this.userModel.create({
      ...createUserDto,
      createdBy: {
        _id: userLogin._id,
        email: userLogin.email,
      },
    });
    return {
      _id: user._id,
      createdAt: user.createdAt,
    };
  }

  async findOne(email: string) {
    const user = await this.userModel
      .findOne({
        email: email,
      })
      .select('-password');
    return user;
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, projection, population, sort } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const defaultLimit = 10;
    const currentLimit = +limit ? +limit : defaultLimit;
    const offset = (+page - 1) * currentLimit;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / currentLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(currentLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();
    return {
      meta: {
        current: page, //trang hiện tại
        pageSize: currentLimit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findUser(email: string) {
    const user = await this.userModel.findOne({
      email: email,
    });
    return user;
  }

  async update(
    updateUserDto: UpdateUserDto,
    @UserDecorator() userLogin: IUser,
  ) {
    const { email, ...dataUpdate } = updateUserDto;
    const result = await this.userModel.updateOne(
      {
        email: email,
      },
      {
        ...dataUpdate,
        updatedBy: {
          _id: userLogin._id,
          email: userLogin.email,
        },
      },
    );
    return result;
  }

  async remove(email: string, @UserDecorator() userLogin: IUser) {
    await this.userModel.updateOne(
      { email },
      {
        deletedBy: {
          _id: userLogin._id,
          email: userLogin.email,
        },
      },
    );
    const result = await this.userModel.softDelete({
      email: email,
    });
    return result;
  }

  async register(registerUserDto: RegisterUserDto) {
    const isVal = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (isVal) {
      throw new BadRequestException(
        `Email ${registerUserDto.email} đã được đăng ký trên hệ thống!!!`,
      );
    }

    const saltOrRounds = 10;
    registerUserDto.password = await bcrypt.hash(
      registerUserDto.password,
      saltOrRounds,
    );
    const user = await this.userModel.create({
      ...registerUserDto,
      role: role.user,
    });
    return user;
  }

  async updateRefreshToken(refreshToken: string, email: string) {
    await this.userModel.updateOne(
      {
        email: email,
      },
      {
        refreshToken: refreshToken || '',
      },
    );
  }

  async getUserByRefreshToken(refreshToken: string) {
    const user: IUser = await this.userModel.findOne({
      refreshToken: refreshToken,
    });
    return user;
  }
}
