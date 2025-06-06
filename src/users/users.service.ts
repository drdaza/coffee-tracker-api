import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

  constructor(
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  private readonly logger = new Logger(UsersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }
  async create(createUserDto: CreateUserDto) {

    const { password, ...userData } = createUserDto;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const getUser = await this.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (getUser) {
      throw new Error('User already exists');
    }
    const user = await this.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: { id: string }): string {
    const token = this.jwtService.sign(payload);
    return token;
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

  async findOneByEmail(email: string) {
    return this.user.findUnique({
      where: { email, deleted: false },
    });
  }

  async findOneById(id: string) {
    try {
      
      return this.user.findUnique({
        where: { id, deleted: false },
      });
    } catch (error) {
      console.log(error);
      
      throw new NotFoundException('User not found');
    }
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
