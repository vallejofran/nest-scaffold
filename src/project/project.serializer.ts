import { Expose } from 'class-transformer';

export class ProjectSerializer {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  stack: string; // Agrega solo los campos que quieres exponer
}