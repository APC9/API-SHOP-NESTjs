import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';

@Entity({name: 'products-images'})// nombre de las tablas en la base de datos
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

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