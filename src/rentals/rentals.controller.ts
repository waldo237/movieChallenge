import { Controller, Post, Body } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalValidationPipe } from './dto/rentalValidation.pipe';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  create(@Body(new RentalValidationPipe()) createRentalDto: CreateRentalDto) {
    return this.rentalsService.create(createRentalDto);
  }
}
