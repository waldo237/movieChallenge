import { PartialType } from '@nestjs/mapped-types';
import { Movie } from '../entities/movie.entity';

/**
 * inherit the Movie model
 */
export class CreateMovieDto extends PartialType(Movie) {}
