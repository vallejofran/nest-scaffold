import { Exclude, Expose, Type } from 'class-transformer'
import { ProjectSerializer } from 'src/project/project.serializer'

export class UserSerializer {
  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  role: string

  @Expose()
  @Type(() => ProjectSerializer) // Convierte automáticamente cada proyecto
  projects: ProjectSerializer[]

  @Exclude() // 🔒 No se enviará en la respuesta
  password: string
}
