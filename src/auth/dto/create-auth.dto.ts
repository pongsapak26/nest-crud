import { IsString, MinLength } from "class-validator"

export class CreateAuthDto {
    @IsString()
    email: string

    @IsString()
    @MinLength(8, { message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร' })
    password: string
}
