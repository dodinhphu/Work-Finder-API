import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobMode: SoftDeleteModel<JobDocument>,
  ) {}

  async create(createJobDto: CreateJobDto, userInfo: IUser) {
    const job = await this.jobMode.create({
      ...createJobDto,
      createdBy: {
        _id: userInfo._id,
        email: userInfo.email,
      },
    });
    return job;
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, population, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultLimit = 10;
    const currentLimit = +limit ? +limit : defaultLimit;
    const offset = (+page - 1) * currentLimit;
    const totalItems = (await this.jobMode.find(filter)).length;
    const totalPages = Math.ceil(totalItems / currentLimit);

    const result = await this.jobMode
      .find(filter)
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
      return 'Không tìm thấy Job!';
    }
    return await this.jobMode.findById(id);
  }

  async update(id: string, updateJobDto: UpdateJobDto, userInfo: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Không tìm thấy Job!';
    }

    return await this.jobMode.updateOne(
      {
        _id: id,
      },
      {
        ...updateJobDto,
        updatedBy: {
          _id: userInfo._id,
          email: userInfo.email,
        },
      },
    );
  }

  async remove(id: string, userInfo: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Không tìm thấy Job!';
    }
    await this.jobMode.updateOne(
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
    return this.jobMode.softDelete({
      _id: id,
    });
  }
}
