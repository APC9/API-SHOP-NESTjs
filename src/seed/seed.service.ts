import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(
    // importar el servicio de productos para poder usar sus metodos
    private readonly productsService : ProductsService,

    @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ) { }

  async runSeed() {

    await this.deleteTables();

    const adminUser = await this.insertUsers();

    await this.insertNewProduct(adminUser);

    return 'SEED EXECUTED'
  }

  private async deleteTables(){
    //Borrar todos los productos de  la BD
    await this.productsService.deleteAll();

    //luego Borra todos los usarios
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();

  }

  private async  insertUsers(){
    const seedUser = initialData.users;
    const users: User[] = [];

    seedUser.forEach(user => {
      user.password = bcrypt.hashSync(user.password, 10);
      users.push( this.userRepository.create(user) );
    })

    await this.userRepository.save(users);
    return users[0];
  }

  private async insertNewProduct(user: User){

    await this.productsService.deleteAll();

    const products = initialData.products;

    const insertPromises = [];

     products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user));
    }); 

    await Promise.all(insertPromises);
    
    return true;
  }
}
