import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@example.com',
    type: String
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'mySecurePassword123',
    minLength: 6,
    type: String
  })
  @IsString()
  @MinLength(6)
  password: string;
}