import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userInfo: IUser) {
    const company = await this.companyModel.create({
      createdBy: {
        _id: userInfo._id,
        email: userInfo.email,
      },
      ...createCompanyDto,
    });
    return company;
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, projection, population, sort } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const defaultLimit = 10;
    const currentLimit = +limit ? +limit : defaultLimit;
    const offset = (+page - 1) * currentLimit;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / currentLimit);
    
    const result = await this.companyModel
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

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    userInfo: IUser,
  ) {
    const result = await this.companyModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: userInfo._id,
          email: userInfo.email,
        },
      },
    );
    return result;
  }

  async remove(id: string, userInfo: IUser) {
    await this.companyModel.updateOne(
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
    const result = await this.companyModel.softDelete({
      _id: id,
    });
    return result;
  }
}
