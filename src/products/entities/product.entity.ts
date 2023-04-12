import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity'; 

//Definir las propiedades de la tabla de productos en la base de datos
@Entity({name: 'products'}) //importar y definir nombre de las tablas en la base de datos
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column('text',{
    unique: true,
  })
  title: string;

  @Column('float',{
    default: 0,
  })
  price: number;

  //otra forma de hacerlo
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @Column({
    type: 'text',
    unique: true
  })
  slug: string;

  @Column({
    type: 'int',
    default: 0
  })
  stock: number;

  @Column({
    type: 'text',
    array: true
  })
  sizes:string[];

  @Column({
    type: 'text',
  })
  gender:string;

  @Column({
    type: 'text',
    array: true,
    default: []
  })
  tags: string[];

  // Relacion de uno a mucho: relacionado un producto a muchas imagenes
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    { 
      cascade: true, // eliminacion en cascada de las imagenes relacionadas al producto
      eager: true // cada vez que se usa cualquier metodo find* cargar la relacion de productImages
    }
  )
  images?: ProductImage[]

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