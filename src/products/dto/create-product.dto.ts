import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductDto {

  @IsString()
  @MinLength(1)
  title: string;
  
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true }) //cada uno de los elementos del array debe se string
  @IsArray()
  sizes: string[];

  @IsString({ each: true }) //cada uno de los elementos del array debe se string
  @IsArray()
  @IsOptional()
  tags: string[];
  
  @IsString({ each: true }) //cada uno de los elementos del array debe se string
  @IsArray()
  @IsOptional()
  images?: string[];

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
