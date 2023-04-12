import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Product, ProductImage } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {

  // Errores mas especificos con el formato de Nestjs
  private readonly logger = new Logger('ProductsService');

  constructor(

    // injectar el product con el pratron Repository
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    //contine la cadena de conexion de la base de datos
    private readonly dataSources: DataSource,

  ){}

  async create(createProductDto: CreateProductDto, user: User) {
    
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        user,
        images: images.map( image => this.productImageRepository.create({ url: image }) )
      });
      
      await this.productRepository.save(product);
      return {
        ...product,
        images
      };

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async findAll(paginationDto:PaginationDto) {
    const { limit = 10, offset = 0} = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,

      // product.entity.ts  @OneToMany( {eager: true}) no hace falta el codigo de abajo
      /* relations: {
        images: true //relaciona la tabla de images con la de product para poder mostrarla
      } */
    })

    return products.map(product => ({
        ...product,
        images: product.images.map(image => image.url)
      }) 
    )
  }

  private async findOne(term: string) {
    let product: Product;

    // Buscar por id y por el slug
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({id:term});
    } else{
    //Buscar por title y slug
      const queryBuilder = this.productRepository.createQueryBuilder('prod')
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term.toUpperCase()
      })
      .leftJoinAndSelect('prod.images', 'prodImages') // ralaciona la tabla de images ya que el @OneToMany( {eager: true}) solo funcion con los metodos find*
      .getOne();

    }

    if (!product) 
      throw new BadRequestException(`Product with ${term} not found`);

    return product;
  }

  async findOnePlain(term:string){
    const product = await this.findOne(term)
    return {
      ...product,
      images: product.images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id, //Buscar el objeto por id
      ...toUpdate, // carga todas las propieades que vengan por el updateProductDto
    }) 
    
    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);
    
    // Crear query runner para la actualizar las imagenes
    const queryRunner = this.dataSources.createQueryRunner();
    await queryRunner.connect(); // conectar a la base de datos
    await queryRunner.startTransaction(); // iniciar transaccion
   
    try {

      // Borrar las  imagenes
      if( images ){
        // Elimina las imagenes cuyo id sea igual al id de product
        await queryRunner.manager.delete(ProductImage, { product: { id } } );

        // Agregar las nuevas imagenes
        product.images = images.map(
          image => this.productImageRepository.create({ url: image })
        )
      }

      //Actualizar el usuario que modifico el product
      product.user = user;

      //intenta guardar el product  --- queryRunner.manager no impacta la base datos aun 
      await queryRunner.manager.save(product);
      //await this.productRepository.save(product);

      // Realiza el commit de la transaccion y la finaliza
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
    
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return `Product #${id} removed`;
  }

  private handleExceptions(error:any){
      //error en consola con el formato de Nestjs
      if ( error.code === '23505')
        throw new BadRequestException(error.detail);

      this.logger.error(error);
      throw new InternalServerErrorException('Unexpeced error, check server logs');
  }

  async deleteAll(){
    const query = this.productRepository.createQueryBuilder('product');

    try {

      return await query.delete().where({}).execute();

    } catch (error) {
      this.handleExceptions(error)
    }
  }
}
