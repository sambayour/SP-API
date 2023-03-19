import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/entities/media.entity';
import { StatusMessage } from 'src/util/global.enum';
import { Repository } from 'typeorm';
import { PageOptionsDto } from './dto/pageoption.dto';
import { SearchQueryDto } from './dto/search.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}
  public async getAll(filter: PageOptionsDto) {
    console.log(filter);
    const { page, perPage } = filter;
    if (!page && !perPage) {
      throw new BadRequestException('Invalid objects');
    }
    return { filter };
  }

  async findById(id: string) {}

  async search(id: SearchQueryDto) {}

  public async update(id: string, fields: UpdateUploadDto) {
    try {
      //   return this.userRepository.update(id, fields);
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: StatusMessage.FAILED,
        data: error,
      };
    }
  }

  softDelete = (mediaId: string) => {
    try {
      return 'softDelete';
      // return Media.query().patchAndFetchById(mediaId, {
      //   deleted_at: new Date(),
      // });
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: StatusMessage.FAILED,
        data: error,
      };
    }
  };

  async upload(file, payload: UploadDto) {
    console.log('file', file);
    try {
      const response = await this.mediaRepository.save({
        file_name: file.originalname,
        file_type: file.mimetype,
        url: 'google.com',
        description: payload.description,
      });

      return {
        status: 'success',
        message: StatusMessage.SUCCESS,
        data: response,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: StatusMessage.FAILED,
        data: error,
      };
    }
  }
}
