import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { COFFEE_TASTING_RATE_MAX, COFFEE_TASTING_RATE_MIN, COFFEE_TASTING_ATTRIBUTES_MAX, COFFEE_TASTING_ATTRIBUTES_MIN } from "src/common";

export class CreateTastingDto {
    @ApiProperty({
        description: 'Puntuación del aroma del café',
        example: 8,
        minimum: COFFEE_TASTING_ATTRIBUTES_MIN,
        maximum: COFFEE_TASTING_ATTRIBUTES_MAX,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    aroma: number;

    @ApiProperty({
        description: 'Puntuación del sabor del café',
        example: 9,
        minimum: COFFEE_TASTING_ATTRIBUTES_MIN,
        maximum: COFFEE_TASTING_ATTRIBUTES_MAX,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    flavor: number;

    @ApiProperty({
        description: 'Puntuación del cuerpo/textura del café',
        example: 7,
        minimum: COFFEE_TASTING_ATTRIBUTES_MIN,
        maximum: COFFEE_TASTING_ATTRIBUTES_MAX,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    body?: number;

    @ApiProperty({
        description: 'Puntuación de la acidez del café',
        example: 6,
        minimum: COFFEE_TASTING_ATTRIBUTES_MIN,
        maximum: COFFEE_TASTING_ATTRIBUTES_MAX,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    acidity?: number;

    @ApiProperty({
        description: 'Puntuación del balance general del café',
        example: 8,
        minimum: COFFEE_TASTING_ATTRIBUTES_MIN,
        maximum: COFFEE_TASTING_ATTRIBUTES_MAX,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    balance?: number;

    @ApiProperty({
        description: 'Puntuación del retrogusto del café',
        example: 7,
        minimum: COFFEE_TASTING_ATTRIBUTES_MIN,
        maximum: COFFEE_TASTING_ATTRIBUTES_MAX,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    aftertaste?: number;

    @ApiProperty({
        description: 'Notas descriptivas de la cata',
        example: [
            'Notas de chocolate y caramelo',
            'Final dulce y persistente',
            'Acidez cítrica suave'
        ],
        type: [String],
        required: false
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    notes?: string[];
}
