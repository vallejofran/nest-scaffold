import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator'
import { Role } from 'src/auth/role.enum'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsEnum(Role)
  @IsOptional() // Opcional si quieres que tenga un valor por defecto
  role?: Role
}
