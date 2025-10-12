import {
  IsMongoId,
  isString,
  IsString,
  minLength,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  // get user id
  @IsMongoId()
  userId: string;

  @IsString()
  @MinLength(8)
  old_password: string;

  @IsString()
  @MinLength(8)
  new_password: string;
}
