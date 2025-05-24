import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateCoffeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
} 