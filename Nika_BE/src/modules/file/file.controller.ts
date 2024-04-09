import {
  Post,
  Controller,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  PayloadTooLargeException,
} from '@nestjs/common';
import { FileService } from './file.service';
import { RolesGuard } from '@/guards/roles.guard';
import { Role } from 'module/user/contants/constants';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMAGE_FILE_TYPES, MAX_IMAGE_SIZE } from './constants';


@Controller('files/')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard(Role.Admin))
    
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
      fileFilter: (req, file, cb) =>
        [...IMAGE_FILE_TYPES].includes(file.mimetype)
          ? cb(null, true)
          : cb(new BadRequestException("Unsupported file"), false),
    }),
  )
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { size, mimetype } = file;
    if (IMAGE_FILE_TYPES.includes(mimetype) && size > MAX_IMAGE_SIZE)
      throw new PayloadTooLargeException();
    return await this.fileService.uploadNftMetadataFile(file);
  }
}
