import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { SearchQueryDto } from './dto/search.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadDto } from './dto/upload.dto';
import { MediaService } from './media.service';
import { Request } from 'express';
import { PageOptionsDto } from './dto/pageoption.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAll(
    @Query()
    filter: PageOptionsDto,
  ) {
    return await this.mediaService.getAll(filter);
  }

  @Get(':id')
  async mediaById(@Param('id') id: string) {
    return await this.mediaService.findById(id);
  }

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async search(@Query() query: SearchQueryDto) {
    return await this.mediaService.search(
      query,
      ['name', 'description'],
      query,
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() fields: UpdateUploadDto) {
    return await this.mediaService.update(id, fields);
  }

  @Delete(':id')
  async activate(@Param('id') id: string) {
    return await this.mediaService.softDelete(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() uploadDto: UploadDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({
            // eslint-disable-next-line prettier/prettier
            fileType: new RegExp(
              /^\w+.(jpg|png|jpeg|mp4|3gp|mp3|wav|flac)$/,
              'igm',
            ),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.mediaService.upload(file, uploadDto);
  }
}
