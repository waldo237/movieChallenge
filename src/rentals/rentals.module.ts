import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rental])],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
