import { Controller, Post, Body, UseGuards, Request, UnauthorizedException, Patch, Delete, Param, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from '../jwt/JwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: CreateAuthDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updatepassword')
  async updatePassword(
    @Body() UpdateAuthDto: UpdateAuthDto,
  ) {
    return this.authService.updatePassword(UpdateAuthDto.email, UpdateAuthDto.oldPassword, UpdateAuthDto.newPassword);
  }

  @UseGuards(JwtAuthGuard) // ป้องกันการเข้าถึงด้วย JWT
  @Delete(':id') // ใช้ :id เพื่อระบุ ID ของผู้ใช้ที่จะลบ
  async deleteUser(@Param('id') id: string, @Request() req) {
    const userId = parseInt(id, 10); // แปลง id ที่ได้รับจาก param เป็น number
    return this.authService.deleteUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
