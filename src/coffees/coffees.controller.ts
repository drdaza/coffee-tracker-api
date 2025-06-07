import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { CreateTastingDto } from 'src/tasting/dto/create-tasting.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  // Solo usuarios autenticados pueden crear cafés
  @Post() 
  @Auth()
  create(@Body() createCoffeeDto: CreateCoffeeDto, @GetUser() user: any) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Post(':coffeeId/tasting')
  @Auth()
  addTasting(@Param('coffeeId') coffeeId: string, @Body() createTastingDto: CreateTastingDto, @GetUser() user: any) {
    return this.coffeesService.addTasting(coffeeId, createTastingDto, user.id);
  }

  // Ruta pública - cualquiera puede ver todos los cafés
  @Get()
  @Auth()
  findAll() {
    return this.coffeesService.findAll();
  }

  // Solo usuarios autenticados pueden ver detalles
  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.coffeesService.findOne(id);
  }

  @Get(':coffeeId/tasting')
  @Auth()
  getTastingsByCoffee(@Param('coffeeId') coffeeId: string) {
    return this.coffeesService.getTastingsByCoffeeId(coffeeId);
  }

  // Solo usuarios autenticados pueden actualizar sus propios cafés
  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto, @GetUser() user: any) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  // Solo ADMINs pueden eliminar cualquier café
  @Delete(':id')
  @Auth(ValidRoles.admin)
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