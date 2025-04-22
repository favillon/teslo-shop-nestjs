import { join } from 'path';
import { existsSync } from 'fs';
import { Injectable, BadRequestException } from '@nestjs/common';


@Injectable()
export class FileService {
  getStaticImage(imageName: string) {
    const path = join( __dirname, '../../static/uploads', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException('Image not found');
    }
    return path;
  }
}
