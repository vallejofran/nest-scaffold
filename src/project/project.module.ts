import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
import { Project } from './entities/project.entity'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Project]), forwardRef(() => UserModule)],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [TypeOrmModule], // Exportar TypeOrmModule para que otros módulos lo puedan usar
})
export class ProjectModule {}
