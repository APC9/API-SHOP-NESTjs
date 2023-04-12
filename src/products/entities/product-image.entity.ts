import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';

@Entity({name: 'products-images'})// nombre de las tablas en la base de datos
export class ProductImage {

  @ApiProperty({
    example:'bc7a57c0-1d93-441b-9e9b-8d25c8286522',
    description: 'Product Image ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({
    example:'http://localhost:3000/api/products/Alberto NIKe16',
    description: 'Product Image URL',
  })
  @Column('text')
  url: string;
  // Relacion de muchos a uno: Relacionando muchas imagenes a un producto
  @ManyToOne(
    () => Product,
    (product) => product.images,
    { onDelete: 'CASCADE' } // eliminacion en cascada de las imagenes relacionadas al producto
  )
  product: Product;
}