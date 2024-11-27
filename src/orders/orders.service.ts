import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createOrderDto: Prisma.OrderCreateInput) {
    try {
      return await this.databaseService.order.create({
        data: createOrderDto,
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
    return this.databaseService.order.findMany();
  }

  async findOne(id: number) {
    const order = await this.databaseService.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: Prisma.OrderUpdateInput) {
    try {
      return await this.databaseService.order.update({
        where: {
          id,
        },
        data: updateOrderDto,
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

  async remove(id: number) {
    try {
      return await this.databaseService.order.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Order with id ${id} not found`);
        }
        throw new BadRequestException(error.message);
      }
      // Re-throw other errors if they are not handled
      throw error;
    }
  }
}
