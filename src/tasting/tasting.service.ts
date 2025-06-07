import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateTastingDto } from './dto/create-tasting.dto';
import { UpdateTastingDto } from './dto/update-tasting.dto';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class TastingService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(TastingService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async create(createTastingDto: CreateTastingDto, coffeeId: string, userId: string) {
    const getTasting = await this.tasting.findFirst({
      where: {
        coffeeId,
        userId,
      },
    });

    if (getTasting) {
      throw new BadRequestException('Tasting already exists');
    }

    const tasting = await this.tasting.create({
      data: {
        ...createTastingDto,
        coffeeId,
        userId,
      },
    });
    return tasting;
  }

  async findAllByCoffeeId(coffeeId: string) {
    const tastings = await this.tasting.findMany({
      where: { coffeeId },
    });
    return tastings;
  }

  async findAll() {
    const tastings = await this.tasting.findMany();
    return tastings;
  }

  async findOne(id: string) {
    const tasting = await this.tasting.findUnique({
      where: { id },
    });

    if (!tasting) {
      throw new NotFoundException('Tasting not found');
    }

    return tasting;
  }

  async update(id: string, updateTastingDto: UpdateTastingDto) {
    await this.findOne(id);
    const tasting = await this.tasting.update({
      where: { id },
      data: updateTastingDto,
    });
    return tasting;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.tasting.delete({
      where: { id },
    });
  }
}
