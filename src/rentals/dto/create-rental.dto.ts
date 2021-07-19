import { Rental } from '../entities/rental.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRentalDto {
  customerEmail: string;
  price: number;
  movieId: number;
}
