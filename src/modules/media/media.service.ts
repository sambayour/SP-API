import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/entities/media.entity';
import { StatusMessage } from 'src/util/global.enum';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
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

  findById = async (id: string) => {
    const file = await this.mediaRepository.findOneBy({ id });
    return {
      status: 'success',
      message: StatusMessage.SUCCESS,
      data: file,
    };
  };

  async search(
    repository: Repository<T>,
    searchFields,
    search: SearchQueryDto,
  ) {
    const queryBuilder = repository.createQueryBuilder('alias');
    const whereSearch: FindOptionsWhere<T> = {};
    searchFields.forEach(
      (field) => (whereSearch[`${field}` as string] = ILike(`%${search}%`)),
    );
    queryBuilder.andWhere(whereSearch);
    const [items, totalCount] = await queryBuilder.getManyAndCount();
    return {
      status: 'success',
      message: StatusMessage.SUCCESS,
      data: { items, totalCount },
    };
  }

  async update(id: string, fields: UpdateUploadDto): Promise<any> {
    try {
      const response = await this.mediaRepository
        .createQueryBuilder()
        .update({
          status: fields.status,
        })
        .where({
          id: id,
        })
        .execute();
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

  softDelete = (id: string) => {
    try {
      return {
        status: 'success',
        message: StatusMessage.SUCCESS,
        data: this.mediaRepository.update(id, { deleted_at: new Date() }),
      };
    } catch (error) {
      return {
        status: 'error',
        message: StatusMessage.FAILED,
        data: error,
      };
    }
  };

  async upload(file, payload: UploadDto): Promise<any> {
    console.log('file', file);
    try {
      const response = await this.mediaRepository.save({
        file_name: file.originalname,
        file_type: file.mimetype,
        url: `${process.env.app_url}/files/${file.originalname}`,
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
