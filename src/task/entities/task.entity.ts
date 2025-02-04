import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Project } from 'src/project/entities/project.entity'

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  dificulty: string

  @Column()
  duration: string

  @ManyToOne((type) => Project, (project) => project.tasks)
  project: Project
}

