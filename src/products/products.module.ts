import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage])
  ],
  //exportar servicio para que se pueda usear en otro modulon, en este caso el el seed.module.ts
  exports: [
    ProductsService,
    TypeOrmModule // por si se desea utilizar los repositorios [Product, ProductImage]
  ] 
})
export class ProductsModule {}
