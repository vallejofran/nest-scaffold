import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { plainToInstance } from 'class-transformer'
import { Repository, In } from 'typeorm'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { User } from './entities/user.entity'
import { Project } from 'src/project/entities/project.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserSerializer } from './user.serializer'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    // @Inject(CACHE_MANAGER)
    // private cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto)
      
      // Emitir el evento después de la creación del usuario
      this.eventEmitter.emit('user.created', user)
     
      return await this.userRepository.save(user)
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user.')
    }
  }

  async findAll(): Promise<User[] | UserSerializer[]> {
    try {
      // const value = await this.cacheManager.get<User>('user')
      // if (value) {
      //   return value
      // }

      const users = await this.userRepository.find({ relations: ['projects'] })
      const usersSerialized = plainToInstance(UserSerializer, users, {
        excludeExtraneousValues: true,
      })

      // await this.cacheManager.set('user', users, 3600000)
      return usersSerialized
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users.')
    }
  }

  async findOne(id: number): Promise<User | UserSerializer> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['projects'],
      })
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`)
      }

      const userSerialized = plainToInstance(UserSerializer, user, {
        excludeExtraneousValues: true,
      })
      return userSerialized
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to retrieve user.')
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // Buscar el usuario actual y sus proyectos relacionados
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['projects'],
      })

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`)
      }

      // Si llegan datos para actualizar, actualizamos los campos del usuario
      const { name, email, password } = updateUserDto
      if (name) user.name = name
      if (email) user.email = email
      if (password) user.password = password

      // Guardar los cambios del usuario
      return await this.userRepository.save(user)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to update user.')
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } })
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`)
      }

      await this.userRepository.remove(user)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to delete user.')
    }
  }

  /* Custom methods */
  async addProjectsToUser(userId: number, projectIds: number[]): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['projects'],
      })
      if (!user) throw new NotFoundException('User not found')

      const projects = await this.projectRepository.findBy({
        id: In(projectIds),
      })
      if (projects.length !== projectIds.length) {
        throw new NotFoundException('Some projects not found')
      }

      user.projects = [...user.projects, ...projects]
      return await this.userRepository.save(user) // Actualiza la relación automáticamente
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to add projects to user.')
    }
  }

  async findAuthUser(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      })
      if (!user) {
        throw new NotFoundException('User not found')
      }
      return user
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to find user for authentication.')
    }
  }
}
