import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user-dto.interface';
import { GetRawRequestHeaders } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')  
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Get('check-token') 
  async checkToken(@GetRawRequestHeaders('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    const userInfo = await this.authService.checkToken(token);
    return userInfo;

  }
}
