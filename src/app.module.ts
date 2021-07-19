import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { MoviesModule } from './movies/movies.module';
import { dbRootModule } from './config/database/database';
import { LandingModule } from './app/landing.module';
import { SalesModule } from './sales/sales.module';
import { RentalsModule } from './rentals/rentals.module';
import { LikesModule } from './likes/likes.module';
import { TransactionModule } from './transaction/transaction.module';
@Module({
  imports: [
    dbRootModule,
    LandingModule,
    MoviesModule,
    SalesModule,
    RentalsModule,
    LikesModule,
    TransactionModule,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
