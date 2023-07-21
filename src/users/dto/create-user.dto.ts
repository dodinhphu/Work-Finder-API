import { IsEmail, IsNotEmpty } from 'class-validator';

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
