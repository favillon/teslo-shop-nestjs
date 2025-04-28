import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {

    @ApiProperty({
        example: 'Product 1',
        description: 'Title of the product',
        uniqueItems: true,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example: 15.25,
        description: 'Price of the product',
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        example: 'lorem ipsum dolor sit amet, consectetur adipiscing elit',
        description: 'Description of the product',
    })
    @IsString()
    @IsOptional()
    @MinLength(1)
    description?: string;

    @ApiProperty({
        example: 'product_1',
        description: 'Slug of the product',
        uniqueItems: true,
    })
    @IsString()
    @IsOptional()
    @MinLength(1)
    slug?: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    sizes?: string[];

    @ApiProperty()
    @IsIn(['men', 'woman', 'kid', 'unisex'])
    gender: string;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

}
