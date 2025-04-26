import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    ConfigModule,
    AuthModule
  ],
})
export class FileModule {}
