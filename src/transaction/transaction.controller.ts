import { Controller, Get, Param, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  TransctionParamDto,
  TranstactionPipe,
} from './dto/read.transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/movies/:movieId')
  findAll(
    @Param()
    movie,
    @Query(new TranstactionPipe())
    params: TransctionParamDto,
  ) {
    const { from, to } = params;
    const movieId = Number(movie.movieId);

    return this.transactionService.findOne({ movieId, from, to });
  }
}
