import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Registrar usuario',
    description: 'Crear una nueva cuenta de usuario'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    schema: {
      example: {
        id: 'uuid',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'USER',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Email ya está en uso' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Listar usuarios',
    description: 'Obtener lista de todos los usuarios (solo ADMIN)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios',
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          role: 'USER'
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener usuario por ID',
    description: 'Obtener información detallada de un usuario específico'
  })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado',
    schema: {
      example: {
        id: 'uuid',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'USER',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Actualizar usuario',
    description: 'Actualizar información del usuario'
  })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Eliminar usuario',
    description: 'Eliminar cuenta de usuario (solo ADMIN)'
  })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario eliminado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
