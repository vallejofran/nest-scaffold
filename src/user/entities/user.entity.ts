import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Project } from 'src/project/entities/project.entity'
import { Role } from 'src/auth/role.enum'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  @Exclude()
  password: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: string

  @ManyToMany((type) => Project, (project) => project.users, {
    cascade: true,
  })
  @JoinTable()
  projects: Project[]
}
