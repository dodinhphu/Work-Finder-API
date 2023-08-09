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
import { ResumesService } from './resumes.service';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { ResponeMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { EStatusCv } from './resumers.constant.i';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponeMessage('Tạo mới CV')
  create(@Body() createUserCvDto: CreateUserCvDto, @User() userInfo: IUser) {
    return this.resumesService.create(createUserCvDto, userInfo);
  }

  @Get()
  @ResponeMessage('List CV')
  findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponeMessage('Get CV')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponeMessage('Update CV')
  update(
    @Param('id') id: string,
    @Body('status') statusCv: EStatusCv,
    @User() userInfo: IUser,
  ) {
    return this.resumesService.update(id, statusCv, userInfo);
  }

  @Delete(':id')
  @ResponeMessage('Delete CV')
  remove(@Param('id') id: string, @User() userInfo: IUser) {
    return this.resumesService.remove(id, userInfo);
  }

  @Post('by-user')
  @ResponeMessage('Get list CV by user')
  getListCvByUser(@User() userInfo: IUser) {
    return this.resumesService.getListCvByUser(userInfo);
  }
}
