import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common'
import { TaskService } from './task.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto)
  }

  @Get()
  findAll() {
    return this.taskService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.taskService.findOne(+id)
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.taskService.remove(+id)
  }
}
