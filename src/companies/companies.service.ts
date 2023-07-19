import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';

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

  findAll() {
    return `This action returns all companies`;
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
