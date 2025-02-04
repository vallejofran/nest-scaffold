import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Task } from './entities/task.entity'
import { Project } from 'src/project/entities/project.entity'

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { projectId, ...taskData } = createTaskDto

    // Verificar que el proyecto existe
    const project = await this.projectRepository.findOne({ where: { id: projectId } })
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`)
    }

    // Crear la tarea
    const task = this.taskRepository.create({
      ...taskData,
      project, // Vincular la tarea al proyecto
    })

    // Guardar la tarea
    return await this.taskRepository.save(task)
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find()
  }

  async findOne(id: number): Promise<Task | null> {
    return await this.taskRepository.findOne({ where: { id } })
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } })

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }

    if (updateTaskDto.name) task.name = updateTaskDto.name
    if (updateTaskDto.dificulty) task.dificulty = updateTaskDto.dificulty
    if (updateTaskDto.duration) task.duration = updateTaskDto.duration

    if (updateTaskDto.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: updateTaskDto.projectId },
      })

      if (!project) {
        throw new NotFoundException(`Project with ID ${updateTaskDto.projectId} not found`)
      }

      task.project = project
    }

    return this.taskRepository.save(task)
  }

  async remove(id: number): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } })

    if (!task) {
      throw new Error('Task not found')
    }

    await this.taskRepository.remove(task)
  }
}
