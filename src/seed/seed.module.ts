import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  // import el modulo de productos para poder usar servicio 
  imports: [ 
    ProductsModule,
    AuthModule
  ]
})
export class SeedModule {}
