import { Controller, Body, Post } from '@nestjs/common';

import { BodyDto } from 'module/auth/auth.dto';
import { AuthService } from 'module/auth/services/auth.service';

@Controller('auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: BodyDto) {
    return this.authService.signup(user);
  }

  @Post('signIn')
  async signIn(@Body() user: BodyDto) {
    return this.authService.signin(user);
  }
}
