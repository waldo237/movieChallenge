import { PartialType } from '@nestjs/mapped-types';
import { Sale } from '../entities/sale.entity';
import { CreateSaleDto } from './create-sale.dto';

export class ReturnSaleDto extends PartialType(CreateSaleDto) {
  constructor(sale: Sale) {
    super();
    this.movieId = sale.movieId;
    this.customerEmail = sale.customerEmail;
    this.price = sale.price;
  }
}
