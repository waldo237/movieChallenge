import { PartialType } from '@nestjs/mapped-types';
import { Like } from '../entities/like.entity';

export class CreateLikeDto extends PartialType(Like) {
  movieId: number;
  customerEmail?: string;
  customers?: string;
  likes: number;
}
