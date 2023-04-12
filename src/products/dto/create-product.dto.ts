import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductDto {

  @ApiProperty({ 
    description: 'Product title',
    nullable: false,
    minLength: 1
    })
  @IsString()
  @MinLength(1)
  title: string;
  
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty()
  @IsString({ each: true }) //cada uno de los elementos del array debe se string
  @IsArray()
  sizes: string[];

  @ApiProperty()
  @IsString({ each: true }) //cada uno de los elementos del array debe se string
  @IsArray()
  @IsOptional()
  tags: string[];
  
  @ApiProperty()
  @IsString({ each: true }) //cada uno de los elementos del array debe se string
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;
}


// instalar: yarn add class-validator class-transformer

// Con guración global de pipes en el main.ts

/* 
app.useGlobalPipes(
  new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  })
); 
*/
