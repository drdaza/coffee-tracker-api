import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto, RefreshTokenDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autenticar usuario con email y contraseña'
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso', 
    schema: {
      example: {
        user: { id: 'uuid', name: 'Juan Pérez', email: 'juan@example.com', role: 'USER' },
        token: 'jwt-token-here',
        refreshToken: 'refresh-token-here'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh')
  @ApiOperation({ 
    summary: 'Renovar token',
    description: 'Obtener nuevo token usando refresh token'
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Token renovado exitosamente',
    schema: {
      example: {
        token: 'new-jwt-token',
        refreshToken: 'new-refresh-token'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Get('check-token')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Verificar token',
    description: 'Validar token actual y obtener información del usuario'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token válido',
    schema: {
      example: {
        id: 'uuid',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'USER',
        token: 'refreshed-jwt-token'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  async checkToken(@GetUser() user: User) {
    return {
      ...user,
      token: this.authService.getJwtToken({ id: user.id }),
    };
  }
}
