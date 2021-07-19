import { HttpException, Injectable } from '@nestjs/common';
import { Movie } from '../movies/entities/movie.entity';
import { Connection, getRepository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { ReturnSaleDto } from './dto/return-sale.dto';

@Injectable()
export class SalesService {
  constructor(private connection: Connection) {}

  /**
   * Only available movies can be rented.
   * Decrements stock by 1 and if stock == 0, it becomes unavailable.
   */
  async create(dto: CreateSaleDto): Promise<ReturnSaleDto> {
    const queryRunner = this.connection.createQueryRunner();

    const movie = await getRepository(Movie).findOne(dto.movieId);

    if (!movie || !movie.available) {
      throw new HttpException('This movie is not available', 400);
    }

    await queryRunner.connect(); //SQL transaction starts
    await queryRunner.startTransaction();

    try {
      dto.price = movie.salePrice; //update price
      const sold = await queryRunner.manager.save(Sale, dto);

      // decrement stock by 1 and if stock == 0 => unavailable.
      await queryRunner.manager
        .createQueryBuilder()
        .relation(Movie, 'movieId')
        .of(Sale)
        .update({ stock: movie.stock - 1, available: movie.stock - 1 > 0 })
        .execute();

      await queryRunner.commitTransaction(); //SQL transaction ends
      return new ReturnSaleDto(sold);
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
