import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    try {
      const hashed = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashed;
      return await this.databaseService.user.create({
        data: createUserDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientValidationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new BadRequestException(error.message);
      }
      // Re-throw other errors if they are not handled
      throw error;
    }
  }

  async findAll() {
    return this.databaseService.user.findMany();
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    try {
      return await this.databaseService.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientValidationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new BadRequestException(error.message);
      }
      // Re-throw other errors if they are not handled
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.databaseService.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with id ${id} not found`);
        }
        throw new BadRequestException(error.message);
      }
      // Re-throw other errors if they are not handled
      throw error;
    }
  }
}
