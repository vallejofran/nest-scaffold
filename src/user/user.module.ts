import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from './entities/user.entity'
import { ProjectModule } from '../project/project.module'
import { UserCreatedListener } from './listeners/user.created.listener'

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => ProjectModule)],
  controllers: [UserController],
  providers: [UserService, UserCreatedListener],
  exports: [TypeOrmModule, UserService], // Exportar TypeOrmModule para que otros módulos lo puedan usar
})
export class UserModule {}
