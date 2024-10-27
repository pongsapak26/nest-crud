import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
    @IsString({ message: 'ชื่อผลิตภัณฑ์ต้องเป็นสตริง' })
    name: string;
  
    @IsString({ message: 'คำอธิบายต้องเป็นสตริง' })
    description: string;
  
    @IsNumber({}, { message: 'ราคาไม่ถูกต้อง' })
    @IsPositive({ message: 'ราคาต้องมากกว่า 0' })
    price: number;
  
    @IsNumber({}, { message: 'สต็อกไม่ถูกต้อง' })
    @IsPositive({ message: 'จำนวนสต็อกต้องมากกว่า 0' })
    stock: number;
}
