import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsOptional()
    @IsString({ message: 'ชื่อผลิตภัณฑ์ต้องเป็นสตริง' })
    name?: string;
  
    @IsOptional()
    @IsString({ message: 'คำอธิบายต้องเป็นสตริง' })
    description?: string;
  
    @IsOptional()
    @IsNumber({}, { message: 'ราคาไม่ถูกต้อง' })
    @IsPositive({ message: 'ราคาต้องมากกว่า 0' })
    price?: number;
  
    @IsOptional()
    @IsNumber({}, { message: 'สต็อกไม่ถูกต้อง' })
    @IsPositive({ message: 'จำนวนสต็อกต้องมากกว่า 0' })
    stock?: number;
}
