import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }>{

    if (!file) {
      throw new BadRequestException('Make sure that the file is an image')
    }

    const url = await this.cloudinaryService.uploadImage(file);
    return { url };
  }

  @Get(':id')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const url = await this.cloudinaryService.getImageUrl(id);
    res.status(200).json({
      url
    });
  }
}
