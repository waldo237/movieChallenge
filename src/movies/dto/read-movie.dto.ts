import { Movie } from '../entities/movie.entity';

export class readMovieDto {
  content: Movie[];
  page: number;
  size: number;
  sort: string;
  order: 'ASC' | 'DESC';
  unavailable?: boolean;
  title?: string;
  skip?: number;
  constructor(params: readMovieDto) {
    const { content, page, size, sort, order } = params;
    this.content = content;
    this.page = Number(page) || 0;
    this.size = Number(size) || 0;
    this.sort = sort;
    this.order = order || 'ASC';
    this.unavailable = params.unavailable;
    this.title = params.title;
  }
}
