import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { CommonModule } from './common/common.module';
import { FilesModule } from './files/files.module';
import { ProductsModule } from './products/products.module';
import { SeedModule } from './seed/seed.module';

// Estos 2 Archivos son dos formas distintas de validar las variables de entorno.
import { envConfiguration } from './config/env.config';
import { joiValidationSchema } from './config/joi.config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service'; 


@Module({
  imports: [
    //configuracion variables de entorno
    ConfigModule.forRoot({
      load: [ envConfiguration ],  //crear uno de estos dos archivos para config las variables de entorno.
      //validationSchema: joiValidationSchema // luego importarlo en: ejemplo files.modules.ts
    }),                                      // imports: [ ConfigModule ]
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), // Servir contenido estatico
    }),

    // conexion a la DB con TypeOrm
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST,
      port: +process.env.BD_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,

    CloudinaryModule,
  ],
  controllers: [],
  providers: [CloudinaryService],
})
export class AppModule {}
