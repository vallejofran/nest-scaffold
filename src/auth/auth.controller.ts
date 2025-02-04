import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { Public } from './decorators/auth.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  signIn(@Body() signInDto: AuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.password)
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user
  }
}
