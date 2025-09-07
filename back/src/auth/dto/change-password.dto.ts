import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    readonly new_password: string;
}