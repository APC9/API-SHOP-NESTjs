import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity'; 

//Definir las propiedades de la tabla de productos en la base de datos
@Entity({name: 'products'}) //importar y definir nombre de las tablas en la base de datos
export class Product {

  @ApiProperty({
    example:'bc7a57c0-1d93-441b-9e9b-8d25c8286522',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @ApiProperty({
    example:'T-Shirt Teslo',
    description: 'Product title',
    uniqueItems: true
  })
  @Column('text',{
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  @Column('float',{
    default: 0,
  })
  price: number;

  //otra forma de hacerlo
  @ApiProperty({
    example: 'loreEsse ullamco do duis aliquip ut pariatur pariatur.',
    description: 'Product description',
    default: null
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    example:'t_shirt_teslo',
    description: 'Product SlUG - for  SEO',
    uniqueItems: true
  })
  @Column({
    type: 'text',
    unique: true
  })
  slug: string;

  @ApiProperty({
    example:10,
    description: 'Product stock',
    default: 0
  })
  @Column({
    type: 'int',
    default: 0
  })
  stock: number;

  @ApiProperty({
    example:['M', 'S', 'XL'],
    description: 'Product sizes',
  })
  @Column({
    type: 'text',
    array: true
  })
  sizes:string[];

  @ApiProperty({
    example:'women',
    description: 'Product gender',
  })
  @Column({
    type: 'text',
  })
  gender:string;

  @ApiProperty({
    example:['teslo', 'shop'],
    description: 'Product tags',
    default: []
  })
  @Column({
    type: 'text',
    array: true,
    default: []
  })
  tags: string[];

  // Relacion de uno a mucho: relacionado un producto a muchas imagenes
  @ApiProperty({
    type: ProductImage
  })
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    { 
      cascade: true, // eliminacion en cascada de las imagenes relacionadas al producto
      eager: true // cada vez que se usa cualquier metodo find* cargar la relacion de productImages
    }
  )
  images?: ProductImage[]

/*   @ApiProperty({
    type: User
  }) */
  @ManyToOne(
    () => User,
    (user) => user.product,
    {eager: true} // muestra automáticamente la relacion entre product y user
  )
  user: User;

  @BeforeUpdate() // verifica antes de actualizar en la base de datos
  @BeforeInsert() // verifica antes de insertar en la base de datos
  ckeckSlugInsert(){
    if(!this.slug){
      this.slug = this.title
    }
    
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
  
}

// importarlo en product.module.ts, ejemplo:

// imports: [
//   TypeOrmModule.forFeature([Product])
// ]