import { Module } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { CacheModule } from '@nestjs/cache-manager'
import { EventEmitterModule } from '@nestjs/event-emitter';

import databaseConfig from './config/database.config'
import { AllExceptionFilter } from './common/filters/http-exception.filter'
import { LoggingInterceptor } from './common/interceptors/loggin.interceptor'
import { UserModule } from './user/user.module'
import { ProjectModule } from './project/project.module'
import { TaskModule } from './task/task.module'
import { AuthModule } from './auth/auth.module'
import { AuthGuard } from './auth/guards/auth.guard'
import { RolesGuard } from './auth/guards/roles.guard'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig], cache: true, isGlobal: true }),
    EventEmitterModule.forRoot(),
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     isGlobal: true,
    //     ttl: configService.get<number>('CACHE_TTL'), // 1h
    //     max: configService.get<number>('CACHE_MAX'), // 1h
    //   }),
    //   inject: [ConfigService],
    // }),

    CacheModule.register({
      isGlobal: true,
      ttl: 360000,
      max: 100,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        schema: configService.get<string>('database.schema'),
        entities: [__dirname + '/**/entities/*.entity.{ts,js}'],
        synchronize: true,
        logging: true,
      }),
    }),
    UserModule,
    ProjectModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    /**
     * Por temas de modularidad y claridad, entiendo que es mejor instanciar CacheInterceptor a nivel de controlador o ruta,
     * de esta manera quedara mas claro que rutas se cachean.
     * Me doy cuenta de que inyectar CacheInterceptor a nivel de controlador o aqui como provider, no se comporta de la forma adecuada cuando no
     * se quieren cachear ciertas rutas, por lo tanto la conclusion es que se inyecte a nivel de ruta, para asi poder tener rutas sin cachear
     */
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
