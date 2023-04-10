import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
  imports:[
    ConfigModule,
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: '../../static/uploads',
    }),
  ]
})
export class CloudinaryModule {}
