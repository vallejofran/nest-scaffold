import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { Task } from './entities/task.entity'
import { ProjectModule } from 'src/project/project.module'

@Module({
  imports: [TypeOrmModule.forFeature([Task]), ProjectModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
