import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

@Injectable()
export class UserCreatedListener {
  @OnEvent('user.created')
  handleUserCreatedEvent(payload: any) {
    console.log(`👤 Usuario creado: ${payload.name} - ${payload.email}`)
    // Enviar email de bienvenida, registrar log, etc.
  }
}
