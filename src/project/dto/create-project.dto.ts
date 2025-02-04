import { IsString, IsNotEmpty, IsArray, IsNumber, ArrayNotEmpty } from 'class-validator'

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  stack: string

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true }) // Valida que cada elemento del array sea un número
  usersId: number[] // IDs de usuarios a asociar
}
