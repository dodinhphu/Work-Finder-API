import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'Email Không Được Để Trống' })
  email: string;

  @IsNotEmpty({ message: 'UserId Không Được Để Trống' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Url Không Được Để Trống' })
  url: string;

  @IsNotEmpty({ message: 'Status Không Được Để Trống' })
  status: string;

  @IsNotEmpty({ message: 'CompanyId Không Được Để Trống' })
  @IsMongoId({ message: 'CompanyId Sai Định Dạng' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'JobId Không Được Để Trống' })
  @IsMongoId({ message: 'JobId Sai Định Dạng' })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'Url Không Được Để Trống' })
  url: string;

  @IsNotEmpty({ message: 'CompanyId Không Được Để Trống' })
  @IsMongoId({ message: 'CompanyId Sai Định Dạng' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'JobId Không Được Để Trống' })
  @IsMongoId({ message: 'JobId Sai Định Dạng' })
  jobId: mongoose.Schema.Types.ObjectId;
}
