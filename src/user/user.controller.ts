import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  ParseArrayPipe,
  UseInterceptors,
} from '@nestjs/common'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { Role } from 'src/auth/role.enum'
import { LoggingInterceptor } from 'src/common/interceptors/loggin.interceptor'

@Controller('user')
// @UseInterceptors(interceptor) hasta donde he llegado, al usar el decorador a nivel de controlador se aplica el interceptor a todas las rutas, sin la opcion de poderlo omitir en alguna ruta en cuestion
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(CacheInterceptor)
  // @CacheKey('custom_key')
  // @CacheTTL(5000)
  @Roles(Role.ADMIN, Role.USER)
  findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  @UseInterceptors() /* Omite el interceptor inyectado */
  findOne(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number
  ) {
    return this.userService.findOne(id)
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Put(':id/add-projects')
  addProjectsToUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body('projectIds', ParseArrayPipe) projectIds: number[]
  ) {
    return this.userService.addProjectsToUser(userId, projectIds)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id)
  }
}
