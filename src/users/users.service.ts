import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(UsersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }
  async create(createUserDto: CreateUserDto) {

    const getUser = await this.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (getUser) {
      throw new Error('User already exists');
    }
    const user = this.user.create({
      data: createUserDto,
    });
    return user;
  }

  async findAll() {
    const users = await this.user.findMany({
      where: {
        deleted: false,
      },
    });
    return users.map((user) => ({
      name: user.name,
      email: user.email,
    }));
  }

  async findOne(id: string) {
    const user = await this.user.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      name: user.name, 
      email: user.email
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.user.update({
      where: { id },
      data: {
        deleted: true,
      },
    }); 
  }
}
