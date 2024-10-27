import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('ไม่พบผลิตภัณฑ์ที่ต้องการ');
    }
    return product;
  }
  
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('ไม่พบผลิตภัณฑ์ที่ต้องการ');
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('ไม่พบผลิตภัณฑ์ที่ต้องการ');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'ลบผลิตภัณฑ์สำเร็จ' };
  }
}
