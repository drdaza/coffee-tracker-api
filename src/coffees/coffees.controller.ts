import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { CreateTastingDto } from 'src/tasting/dto/create-tasting.dto';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  // Solo usuarios autenticados pueden crear cafés
  @Post() 
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Crear café',
    description: 'Registrar un nuevo café en la plataforma'
  })
  @ApiBody({ 
    type: CreateCoffeeDto,
    examples: {
      completo: {
        summary: 'Café completo',
        value: {
          name: 'Colombian Supremo',
          price: 2500,
          description: 'Café colombiano de alta calidad con notas de chocolate',
          image: 'https://images.unsplash.com/coffee-colombian.jpg',
          rate: 4
        }
      },
      minimo: {
        summary: 'Café básico',
        value: {
          name: 'Espresso House',
          price: 1800
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Café creado exitosamente',
    schema: {
      example: {
        id: 'uuid',
        name: 'Colombian Supremo',
        price: 2500,
        description: 'Café colombiano de alta calidad',
        rate: 4,
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token requerido' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createCoffeeDto: CreateCoffeeDto, @GetUser() user: any) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Post(':coffeeId/tasting')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Crear cata de café',
    description: 'Añadir una nueva cata/evaluación a un café específico'
  })
  @ApiParam({ name: 'coffeeId', description: 'ID único del café a catar' })
  @ApiBody({ 
    type: CreateTastingDto,
    examples: {
      completa: {
        summary: 'Cata completa',
        value: {
          aroma: 8,
          flavor: 9,
          body: 7,
          acidity: 6,
          balance: 8,
          aftertaste: 7,
          notes: [
            'Notas de chocolate y caramelo',
            'Final dulce y persistente',
            'Acidez cítrica suave'
          ]
        }
      },
      basica: {
        summary: 'Cata básica',
        value: {
          aroma: 7,
          flavor: 8,
          notes: ['Buen café para el desayuno']
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Cata creada exitosamente',
    schema: {
      example: {
        id: 'uuid',
        aroma: 8,
        flavor: 9,
        body: 7,
        notes: ['Notas de chocolate'],
        coffeeId: 'coffee-uuid',
        userId: 'user-uuid',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Café no encontrado' })
  @ApiResponse({ status: 401, description: 'Token requerido' })
  @ApiResponse({ status: 409, description: 'Ya existe una cata para este café por este usuario' })
  addTasting(@Param('coffeeId') coffeeId: string, @Body() createTastingDto: CreateTastingDto, @GetUser() user: any) {
    return this.coffeesService.addTasting(coffeeId, createTastingDto, user.id);
  }

  // Ruta pública - cualquiera puede ver todos los cafés
  @Get()
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Listar cafés',
    description: 'Obtener lista de todos los cafés disponibles'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de cafés',
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'Colombian Supremo',
          price: 2500,
          description: 'Café colombiano de alta calidad',
          rate: 4,
          image: 'https://example.com/image.jpg'
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Token requerido' })
  findAll() {
    return this.coffeesService.findAll();
  }

  // Solo usuarios autenticados pueden ver detalles
  @Get(':id')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener café por ID',
    description: 'Obtener información detallada de un café específico'
  })
  @ApiParam({ name: 'id', description: 'ID único del café' })
  @ApiResponse({ 
    status: 200, 
    description: 'Café encontrado',
    schema: {
      example: {
        id: 'uuid',
        name: 'Colombian Supremo',
        price: 2500,
        description: 'Café colombiano de alta calidad',
        rate: 4,
        tastings: []
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Café no encontrado' })
  @ApiResponse({ status: 401, description: 'Token requerido' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.coffeesService.findOne(id);
  }

  @Get(':coffeeId/tasting')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener catas de un café',
    description: 'Listar todas las catas realizadas para un café específico'
  })
  @ApiParam({ name: 'coffeeId', description: 'ID único del café' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de catas del café',
    schema: {
      example: [
        {
          id: 'uuid',
          aroma: 8,
          flavor: 9,
          body: 7,
          notes: ['Notas de chocolate'],
          user: { name: 'Juan Pérez' },
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Café no encontrado' })
  @ApiResponse({ status: 401, description: 'Token requerido' })
  getTastingsByCoffee(@Param('coffeeId') coffeeId: string) {
    return this.coffeesService.getTastingsByCoffeeId(coffeeId);
  }

  // Solo usuarios autenticados pueden actualizar sus propios cafés
  @Patch(':id')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Actualizar café',
    description: 'Actualizar información de un café existente'
  })
  @ApiParam({ name: 'id', description: 'ID único del café' })
  @ApiBody({ type: UpdateCoffeeDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Café actualizado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Café no encontrado' })
  @ApiResponse({ status: 401, description: 'Token requerido' })
  @ApiResponse({ status: 403, description: 'Sin permisos para actualizar este café' })
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto, @GetUser() user: any) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  // Solo ADMINs pueden eliminar cualquier café
  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Eliminar café',
    description: 'Eliminar un café de la plataforma (solo ADMIN)'
  })
  @ApiParam({ name: 'id', description: 'ID único del café' })
  @ApiResponse({ 
    status: 200, 
    description: 'Café eliminado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Café no encontrado' })
  @ApiResponse({ status: 401, description: 'Token requerido' })
  @ApiResponse({ status: 403, description: 'Permisos de ADMIN requeridos' })
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }

  // Ruta exclusiva para ADMINs - gestión completa
  @Get('admin/all')
  @Auth(ValidRoles.admin)
  findAllForAdmin() {
    return this.coffeesService.findAll();
  }

  // Ejemplo: ruta para obtener información del usuario actual
  @Get('my-profile')
  @Auth(ValidRoles.admin, ValidRoles.user)
  getMyProfile(@GetUser() user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
} 