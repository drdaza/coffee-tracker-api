import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { COFFEE_TASTING_RATE_MAX, COFFEE_TASTING_RATE_MIN, COFFEE_TASTING_ATTRIBUTES_MAX, COFFEE_TASTING_ATTRIBUTES_MIN } from "src/common";

export class CreateTastingDto {
    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    aroma: number;

    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    flavor: number;

    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    body?: number;

    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    acidity?: number;

    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    balance?: number;

    @IsOptional()
    @IsNumber()
    @Min(COFFEE_TASTING_ATTRIBUTES_MIN)
    @Max(COFFEE_TASTING_ATTRIBUTES_MAX)
    aftertaste?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    notes?: string[];
}
