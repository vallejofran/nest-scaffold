import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm'
import { User } from 'src/user/entities/user.entity'
import { Task } from 'src/task/entities/task.entity'

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  stack: string

  @ManyToMany((type) => User, (user) => user.projects)
  users: User[]

  @OneToMany((type) => Task, (task) => task.project)
  tasks: Task[]
}