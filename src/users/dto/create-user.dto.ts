import { IsEmail, MinLength, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'Juan Pérez',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Email único del usuario',
        example: 'juan.perez@example.com',
        type: String
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;  

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'mySecurePassword123',
        minLength: 8,
        type: String
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
