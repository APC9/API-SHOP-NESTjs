import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary'; 

@Injectable()
export class CloudinaryService {
  
  constructor(
    private configService: ConfigService,
  ) {

    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    })

  }

  async uploadImage(file: Express.Multer.File): Promise<string> {

    if (!file){
      throw new BadRequestException('the file is empty')
    }

    const result = await cloudinary.uploader.upload(file.path);
    return result.secure_url;
  }  

  async getImageUrl(id: string): Promise<string> {
    const url = cloudinary.url(id);
    return url;
  }

}
