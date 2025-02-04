import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { Project } from './entities/project.entity'
import { User } from 'src/user/entities/user.entity'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // Crear un nuevo proyecto
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { usersId, ...projectData } = createProjectDto

    // Crear el proyecto
    const project = this.projectRepository.create(projectData)

    // Buscar los usuarios por sus IDs
    if (usersId?.length) {
      const users = await this.userRepository.findBy({ id: In(usersId) })
      if (users.length !== usersId.length) {
        throw new NotFoundException('Some users not found')
      }

      // Asignar los usuarios al proyecto
      project.users = users
    }

    // Guardar el proyecto (TypeORM se encarga de la tabla intermedia)
    return this.projectRepository.save(project)
  }

  // Obtener todos los proyectos
  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({ relations: ['users', 'tasks'] })
  }

  // Obtener un proyecto por ID
  async findOne(id: number): Promise<Project | null> {
    return await this.projectRepository.findOne({ where: { id }, relations: ['users', 'tasks'] })
  }

  // Actualizar un proyecto
  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const { usersId, ...projectData } = updateProjectDto

    // Buscar el proyecto por ID
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users', 'tasks'],
    })

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`)
    }

    // Actualizar los campos del proyecto
    if (projectData.name) project.name = projectData.name
    if (projectData.stack) project.stack = projectData.stack

    // Si se enviaron usersId, actualizar la relación
    if (usersId?.length) {
      const users = await this.userRepository.findBy({ id: In(usersId) })
      if (users.length !== usersId.length) {
        throw new NotFoundException('Some users not found')
      }
      project.users = users // Asignar los usuarios al proyecto
    }

    // Guardar el proyecto con los usuarios actualizados
    return this.projectRepository.save(project)
  }

  // Eliminar un proyecto
  async remove(id: number): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } })
    if (!project) {
      throw new Error('Project not found')
    }

    await this.projectRepository.remove(project)
  }
}
