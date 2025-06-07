import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PrismaClient } from 'generated/prisma';
import { CreateTastingDto } from 'src/tasting/dto/create-tasting.dto';
import { TastingService } from 'src/tasting/tasting.service';

@Injectable()
export class CoffeesService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(CoffeesService.name);
  constructor(private readonly tastingService: TastingService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const getCoffee = await this.coffee.findFirst({
      where: {
        name: createCoffeeDto.name,
        deleted: false,
      },
    });

    if (getCoffee) {
      throw new Error('Coffee already exists');
    }

    const coffee = await this.coffee.create({
      data: createCoffeeDto,
    });
    return coffee;
  }

  async findAll() {
    const coffees = await this.coffee.findMany({
      where: {
        deleted: false,
      },
    });
    return coffees.map((coffee) => ({
      id: coffee.id,
      name: coffee.name,
      price: coffee.price,
    }));
  }

  async findOne(id: string) {
    const coffee = await this.coffee.findFirst({
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!coffee) {
      throw new NotFoundException('Coffee not found');
    }
    return {
      id: coffee.id,
      name: coffee.name,
      price: coffee.price,
    };
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    await this.findOne(id);

    return this.coffee.update({
      where: { id },
      data: updateCoffeeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.coffee.update({
      where: { id },
      data: {
        deleted: true,
      },
    }); 
  }

  async addTasting(coffeeId: string, tasting: CreateTastingDto, userId: string) {
    return this.tastingService.create(tasting, coffeeId, userId);
  }

  async getTastingsByCoffeeId(coffeeId: string) {
    await this.findOne(coffeeId);
    return this.tastingService.findAllByCoffeeId(coffeeId);
  }
} 