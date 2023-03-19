import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query: string;
}
