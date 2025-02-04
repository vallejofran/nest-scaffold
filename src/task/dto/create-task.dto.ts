import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  dificulty: string

  @IsString()
  @IsNotEmpty()
  duration: string

  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}
