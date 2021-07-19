import { Sale } from '../entities/sale.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSaleDto extends PartialType(Sale) {
  customerEmail: string;
  price: number;
  movieId: number;
}
