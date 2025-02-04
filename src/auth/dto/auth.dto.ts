import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator'
import { Role } from '../role.enum'

export class AuthDto {
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

  @IsEnum(Role)
  role?: Role
}
