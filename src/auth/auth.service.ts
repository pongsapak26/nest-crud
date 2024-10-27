import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) { }

  async login(userData: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (!user || !(await bcrypt.compare(userData.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.generateToken(user);
  }

  async register(userData: CreateAuthDto) {
    // ตรวจสอบว่ามีอีเมลนี้ในระบบหรือไม่
    const existingUser = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) {
      throw new ConflictException('อีเมลนี้มีการใช้งานแล้ว');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.prisma.user.create({ data: { email: userData.email, password: hashedPassword } });

    // สร้างและส่ง JWT token กลับ
    return this.generateToken(newUser);
  }

  async updatePassword(email: string, oldPassword: string, newPassword: string) {
    // ดึงข้อมูลผู้ใช้ตาม userId
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new UnauthorizedException('ไม่พบผู้ใช้นี้');
    }

    // ตรวจสอบว่ารหัสผ่านเก่าถูกต้องหรือไม่
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('รหัสผ่านเก่าไม่ถูกต้อง');
    }

    // เข้ารหัสรหัสผ่านใหม่และอัปเดตในฐานข้อมูล
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email: email },
      data: { password: hashedNewPassword },
    });

    return { message: 'เปลี่ยนรหัสผ่านสำเร็จ' };
  }

  async deleteUser(userId: number) {
    // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้ที่ต้องการลบ');
    }

    // ลบผู้ใช้จากฐานข้อมูล
    await this.prisma.user.delete({ where: { id: userId } });

    return { message: 'ลบผู้ใช้สำเร็จ' };
  }
  
  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
