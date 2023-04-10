import { join } from 'path';
import { existsSync } from 'fs';

import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  
  getStaticProductImage( image: string) {
    const path = join( __dirname, '../../static/products', image );

    if ( !existsSync ){
      throw new BadRequestException(`Not found product with image: ${image}`);
    }

    return path;
  }

}

