import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { adaptLikeDto } from './dto/adaptLikeDto';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private connection: Connection,
  ) {}

  //TODO SANATIZATION
  /**
   * uses the power of transtactions to sequence:
   * initalize, pushing to customers, save, count likes
   * @param dto
   * @returns
   */
  async create(dto: CreateLikeDto): Promise<CreateLikeDto> {
    const queryRunner = this.connection.createQueryRunner();
    const movie = await getRepository(Movie).findOne({ movieId: dto.movieId });
    if (!movie || !movie.available) {
      throw new HttpException('Movie is not available', 400);
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager //save
        .getRepository(Like)
        .save(adaptLikeDto(dto));

      const likes = await queryRunner.manager //count likes for this movie
        .getRepository(Like)
        .count({ where: { movieId: dto.movieId } });

      await queryRunner.commitTransaction();

      return adaptLikeDto({ ...result, likes });
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
