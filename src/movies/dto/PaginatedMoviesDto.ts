import { Movie } from '../entities/movie.entity';
import { readMovieDto } from './read-movie.dto';

export class PaginatedMoviesDto {
  content: Movie[];
  size: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  number: number;

  constructor(params: readMovieDto, content: Movie[], totalElements: number) {
    this.content = content;
    this.size = params.size;
    this.numberOfElements = content.length;
    this.totalElements = totalElements;
    this.number = params.page;
    this.content = content;
    this.totalPages = Math.ceil(totalElements / params.size);
  }
}
