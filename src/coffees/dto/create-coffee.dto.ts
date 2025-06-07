import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { COFFEE_TASTING_RATE_MAX, COFFEE_TASTING_RATE_MIN } from 'src/common';

export class CreateCoffeeDto {
  @ApiProperty({
    description: 'Nombre del café',
    example: 'Colombian Supremo',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Precio del café en centavos',
    example: 2500,
    minimum: 0,
    type: Number
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Descripción detallada del café',
    example: 'Café colombiano de alta calidad con notas de chocolate y caramelo',
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL de la imagen del café',
    example: 'https://images.unsplash.com/coffee-colombian.jpg',
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Calificación general del café',
    example: 4,
    minimum: COFFEE_TASTING_RATE_MIN,
    maximum: COFFEE_TASTING_RATE_MAX,
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  @Min(COFFEE_TASTING_RATE_MIN)
  @Max(COFFEE_TASTING_RATE_MAX)
  rate?: number;
} 