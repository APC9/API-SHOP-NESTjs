import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ValidRoles } from '../interfaces';

export class CreateUserDto {

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty()
  @IsString({ each: true }) //cada uno de los elementos del array debe se string
  @IsArray()
  @IsEnum( ValidRoles, { each: true })
  roles: string[];
}