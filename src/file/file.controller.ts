
import { Response } from 'express';
import { BadRequestException,  Controller, Get, Param, Res, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { diskStorage } from 'multer';

import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from 'src/helpers/';
import { ConfigService } from '@nestjs/config';


@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.fileService.getStaticImage(imageName);
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }))
  uploadFile(
    @UploadedFile()  file : Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('File not format');
    }
    const urlFile = `${this.configService.get('HOST_API')}/file/product/${file.filename}`;
    return {
      urlFile,
    };
  }
}
