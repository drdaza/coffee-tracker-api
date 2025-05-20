import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
