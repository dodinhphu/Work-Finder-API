import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { IUser } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { EStatusCv } from './resumers.constant.i';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private ResumeModule: SoftDeleteModel<ResumeDocument>,
  ) {}

  async create(createUserCvDto: CreateUserCvDto, userInfo: IUser) {
    const newCV = await this.ResumeModule.create({
      ...createUserCvDto,
      userId: userInfo._id,
      email: userInfo.email,
      status: EStatusCv.PENDING,
      createdBy: { _id: userInfo._id, email: userInfo.email },
      history: {
        status: EStatusCv.PENDING,
        updatedAt: new Date(),
        updatedBy: { _id: userInfo._id, email: userInfo.email },
      },
    });
    return {
      _id: newCV.id,
      createdAt: newCV.createdAt,
    };
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, population, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultLimit = 10;
    const currentLimit = +limit ? +limit : defaultLimit;
    const offset = (+page - 1) * currentLimit;
    const totalItems = (await this.ResumeModule.find(filter)).length;
    const totalPages = Math.ceil(totalItems / currentLimit);

    const result = await this.ResumeModule.find(filter)
      .skip(offset)
      .limit(currentLimit)
      .sort(sort as any)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID CV không hợp lệ');
    }

    const cv = await this.ResumeModule.findById(id);
    return cv;
  }

  async update(id: string, statusCv: EStatusCv, userInfo: IUser) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID CV không hợp lệ');
      }
      const result = await this.ResumeModule.updateOne(
        {
          _id: id,
        },
        {
          status: statusCv,
          updatedBy: {
            _id: userInfo._id,
            email: userInfo.email,
          },
          $push: {
            history: {
              status: statusCv,
              updatedAt: new Date(),
              updatedBy: {
                _id: userInfo._id,
                email: userInfo.email,
              },
            },
          },
        },
      );
      return result;
    } catch (error) {
      return new BadRequestException('Lỗi Server!!!');
    }
  }

  async remove(id: string, userInfo: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID CV không hợp lệ');
    }

    await this.ResumeModule.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: userInfo._id,
          email: userInfo.email,
        },
      },
    );
    return this.ResumeModule.softDelete({
      _id: id,
    });
  }

  async getListCvByUser(userInfo: IUser) {
    return await this.ResumeModule.find({
      userId: userInfo._id,
    });
  }
}
