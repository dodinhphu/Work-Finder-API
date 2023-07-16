import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Mame Không Được Bỏ Trống' })
  name: string;

  @IsNotEmpty({ message: 'Address Không Được Bỏ Trống' })
  address: number;

  @IsNotEmpty({ message: 'Description Không Được Bỏ Trống' })
  description: string;
}
