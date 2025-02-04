import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos desde los metadatos
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), // Verifica los metadatos en el método
      context.getClass(), // Verifica los metadatos en la clase
    ])

    // Si no hay roles especificados, permitir el acceso
    if (!requiredRoles) {
      return true
    }

    // Obtener el usuario de la solicitud
    const { user } = context.switchToHttp().getRequest()

    // Verificar si el usuario tiene alguno de los roles requeridos
    return user && user.role && requiredRoles.includes(user.role)
  }
}
