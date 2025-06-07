import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, Max } from 'class-validator';
import { COFFEE_TASTING_RATE_MAX, COFFEE_TASTING_RATE_MIN } from 'src/common';

export class CreateCoffeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;


  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Min(COFFEE_TASTING_RATE_MIN)
  @Max(COFFEE_TASTING_RATE_MAX)
  rate?: number;
} 