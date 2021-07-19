import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { readMovieDto } from './dto/read-movie.dto';
import { PaginatedMoviesDto } from './dto/PaginatedMoviesDto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Like } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  /**
   *@method store the movie into the repository
   */
  async create(@Body() dto: CreateMovieDto) {
    const res = await this.moviesRepository.save(dto).catch(this.errorThrower);
    return res;
  }

  /**
   * only available movies should be response by default,
   * if unavailable=true returns all the movies.
   * By default, each page must have at most 12 elements.
   */
  async findAll(params: readMovieDto): Promise<PaginatedMoviesDto> {
    const { unavailable, title, size } = params;

    if (unavailable) {
      return await this.fetchMovies(params);
    } else if (!title && !size) {
      // return 12
      return await this.fetchMovies({ ...params, size: 12 });
    } else {
      return await this.fetchMovies(params);
    }
  }

  /**
   * update the movie based on the given id and payload
   * @returns response with 200 and movie information
   */
  async update(movieId: number, updateMovieDto: UpdateMovieDto) {
    const exists = await this.findOne(movieId);
    if (!exists) {
      throw new NotFoundException('Could not update');
    }

    //save performs updates with partial and returns object; update does not.
    const res = await this.moviesRepository
      .save({ movieId, ...updateMovieDto })
      .catch(this.errorThrower);

    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  /**
   * • Should delete the movie based on the given id
   * • A cascade delete should be performed
   */
  async remove(movieId: number) {
    const exists = await this.findOne(movieId);
    if (!exists) {
      throw new NotFoundException('Could not delete');
    }

    return await this.moviesRepository.delete(movieId).catch(this.errorThrower);
  }

  /* PRIVATE METHODS AND HELPERS */
  private async findOne(movieId: number) {
    return await this.moviesRepository.findOne(movieId);
  }

  private async fetchMovies(params: readMovieDto): Promise<PaginatedMoviesDto> {
    const query = this.buildQuery(params);
    const totalElements = await this.moviesRepository
      .count({ where: query.where })
      .catch(this.errorThrower);

    const data = await this.moviesRepository
      .find(query)
      .catch(this.errorThrower);

    return new PaginatedMoviesDto(params, data || [], totalElements || 0);
  }

  /**
   * uses object array notation and computed properties
   *  to add parameters dynamically to a query object literal
   * @returns query object
   */
  private buildQuery(params: readMovieDto) {
    const { page, size, title } = params;
    const where = {};
    if (!params['unavailable']) where['available'] = true;
    if (params['title']) where['title'] = Like(`%${title}%`);

    const sort = params.order?.toUpperCase(); //makes asc -> ASC

    const skipDouble = size && page ? size - size : size; //if page provided, skip previous values

    const query = {
      where,
      order: { [params.sort || 'title']: sort },
      skip: (page - 1) * skipDouble || size,
      take: size,
    };
    return query;
  }

  /**
   * Throws a BadRequestException and console logs.
   */
  private errorThrower(e): void {
    console.error(e);
    throw new BadRequestException();
  }
}
