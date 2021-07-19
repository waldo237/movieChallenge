import { HttpException, Injectable } from '@nestjs/common';
import { TransctionParamDto } from './dto/read.transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityTarget,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Rental } from '../rentals/entities/rental.entity';
import { ReturnTranscDTO } from './dto/return.transaction.dto';
import { Sale } from '../sales/entities/sale.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  /**
   * returns information of a movie's transaction based on ids and dates
   */
  async findOne(params: TransctionParamDto): Promise<ReturnTranscDTO> {
    const { movieId, from, to } = params;
    const movie = await this.moviesRepository.findOne({ movieId });

    if (!movie) {
      throw new HttpException('movie not found', 404);
    }

    const rentalQb = this.queryShortener(Rental, movieId, from, to);
    const saleQb = this.queryShortener(Sale, movieId, from, to);
    return await this.transactionBuilder(rentalQb, saleQb, movieId);
  }

  /**
   *  builds a the first part of the query
   */
  private queryShortener(
    entity: EntityTarget<unknown>,
    movieId: number,
    from: string,
    to: string,
  ): SelectQueryBuilder<unknown> {
    return getRepository(entity)
      .createQueryBuilder()
      .where('createdAt >= :from', { from })
      .andWhere('createdAt <= :to', { to })
      .andWhere('movieId == :movieId', { movieId });
  }

  /**
   * TODO needs to be made more efficient with leftJoin
   * to send less request to the database
   */
  private async transactionBuilder(
    rentalQb: SelectQueryBuilder<unknown>,
    saleQb: SelectQueryBuilder<unknown>,
    movieId: number,
  ): Promise<ReturnTranscDTO> {
    try {
      const rentals = await this.extractDates(rentalQb);
      const sales = await this.extractDates(saleQb);
      const customers = await this.extractEmails(rentalQb, saleQb);
      const totalRevenue = await this.extractRevenue(rentalQb, saleQb);

      return new ReturnTranscDTO(
        movieId,
        rentals,
        sales,
        totalRevenue,
        customers,
      );
    } catch (e) {
      console.error(e);
    }
  }

  private async extractRevenue(
    qb1: SelectQueryBuilder<unknown>,
    qb2: SelectQueryBuilder<unknown>,
  ): Promise<number> {
    const extractor = async (qb) => {
      return await qb
        .select('SUM(price)', 'rv')
        .getRawOne()
        .then((rev) => rev.rv);
    };

    const rev1 = await extractor(qb1);
    const rev2 = await extractor(qb2);
    return rev1 + rev2;
  }

  private async extractDates(
    qb: SelectQueryBuilder<unknown>,
  ): Promise<string[]> {
    return await qb
      .select('createdAt')
      .execute()
      .then(
        (date) =>
          date.map((d) => new Date(d['createdAt']).toISOString().split('T')[0]), //turn date backt to yyyy-mm-dd
      );
  }

  private async extractEmails(
    rentalQb: SelectQueryBuilder<unknown>,
    saleQb: SelectQueryBuilder<unknown>,
  ) {
    return await rentalQb
      .select('customerEmail')
      .execute()
      .then(async (r) => {
        const s = await saleQb.select('customerEmail').execute();
        return [...r, ...s].map((email) => email['customerEmail']);
      });
  }
}
