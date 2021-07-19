import { HttpException, Injectable } from '@nestjs/common';
import { Movie } from '../movies/entities/movie.entity';
import { Connection, getRepository } from 'typeorm';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Rental } from './entities/rental.entity';
import { ReturnRentalDto } from './dto/return-rental.dto';

@Injectable()
export class RentalsService {
  constructor(private connection: Connection) {}

  /**
   * Only available movies can be rented.
   * Decrements stock by 1 and if stock == 0, it becomes unavailable.
   */
  async create(dto: CreateRentalDto): Promise<ReturnRentalDto> {
    const queryRunner = this.connection.createQueryRunner();

    const movie = await getRepository(Movie).findOne(dto.movieId);

    if (!movie || !movie.available) {
      throw new HttpException('This movie is not available', 400);
    }

    await queryRunner.connect(); //SQL transaction starts
    await queryRunner.startTransaction();

    try {
      dto.price = movie.rentalPrice; //update price
      const rented = await queryRunner.manager.save(Rental, dto);

      // decrement stock by 1 and if stock == 0 => unavailable.
      await queryRunner.manager
        .createQueryBuilder()
        .relation(Movie, 'movieId')
        .of(Rental)
        .update({ stock: movie.stock - 1, available: movie.stock - 1 > 0 })
        .execute();

      await queryRunner.commitTransaction(); //SQL transaction ends
      return new ReturnRentalDto(rented);
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
