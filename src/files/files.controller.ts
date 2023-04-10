import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,

    //para usar las variables de entorno: Valla a app.module.ts
    private readonly configService: ConfigService,
    ) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter, 
    //limits: { fieldSize: 1000 } limite del tamaño del archivo
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage( @UploadedFile() file: Express.Multer.File ) {

    if (!file) {
      throw new BadRequestException('Make sure that the file is an image')
    }

    const {filename, ...rest} = file;
    
    return {
      secureUrl: `${this.configService.get<string>('hostApi')}/files/product/${filename}`,
    };
  }

  @Get('product/:imageName')
  findProductImage( 
    @Res() res: Response, // si uso este decorador, debo retornar una respuesta de forma manual 
    @Param('imageName') imageName: string 
    ) {
    
      res.sendFile( this.filesService.getStaticProductImage(imageName) );
  }
}
