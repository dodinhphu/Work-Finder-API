import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Name Không Được Để Trống' })
  name: string;

  @IsNotEmpty({ message: 'skills Không Được Để Trống' })
  @IsArray({ message: 'skills có định dạng là Array' })
  @IsString({ each: true, message: 'skills có định dạng là string' })
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({ message: 'Location Không Được Để Trống' })
  location: string;

  @IsNotEmpty({ message: 'Quantity Không Được Để Trống' })
  quantity: number;

  @IsNotEmpty({ message: 'Level Không Được Để Trống' })
  level: string;

  @IsNotEmpty({ message: 'Description Không Được Để Trống' })
  description: string;

  @IsNotEmpty({ message: 'Start Date Không Được Để Trống' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Start Date có định dạng là date' })
  startDate: Date;

  @IsNotEmpty({ message: 'End Date Không Được Để Trống' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'End Date có định dạng là date' })
  endDate: Date;

  @IsNotEmpty({ message: 'Is Active Không Được Để Trống' })
  @IsBoolean({ message: 'Is Active có định dạng là Boolean' })
  isActive: boolean;
}
