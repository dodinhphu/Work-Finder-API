import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name Không Được Để Trống' })
  name: string;

  @IsNotEmpty({ message: 'Email Không Được Để Trống' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password Không Được Để Trống' })
  password: string;

  @IsNotEmpty({ message: 'Age Không Được Để Trống' })
  age: number;

  @IsNotEmpty({ message: 'Gender Không Được Để Trống' })
  gender: string;

  @IsNotEmpty({ message: 'Address Không Được Để Trống' })
  address: string;

  @IsNotEmpty({ message: 'Role Không Được Để Trống' })
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name Không Được Để Trống' })
  name: string;

  @IsNotEmpty({ message: 'Email Không Được Để Trống' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password Không Được Để Trống' })
  password: string;

  @IsNotEmpty({ message: 'Age Không Được Để Trống' })
  age: number;

  @IsNotEmpty({ message: 'Gender Không Được Để Trống' })
  gender: string;

  @IsNotEmpty({ message: 'Address Không Được Để Trống' })
  address: string;
}
