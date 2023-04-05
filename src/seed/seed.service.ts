import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    // importar el servicio de productos para poder usar sus metodos
    private readonly productsService : ProductsService
  ) { }

  async runSeed() {
    return await this.insertNewProduct();
  }

  private async insertNewProduct(){
    await this.productsService.deleteAll();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);
    
    return true;
  }
}
