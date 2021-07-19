import { PartialType } from '@nestjs/mapped-types';
import { Rental } from '../entities/rental.entity';
import { CreateRentalDto } from './create-rental.dto';

export class ReturnRentalDto extends PartialType(CreateRentalDto) {
  constructor(rental: Rental) {
    super();
    this.movieId = rental.movieId;
    this.customerEmail = rental.customerEmail;
    this.price = rental.price;
  }
}
