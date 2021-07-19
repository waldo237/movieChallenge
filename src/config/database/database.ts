import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../../sales/entities/sale.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Rental } from '../../rentals/entities/rental.entity';
import { Like } from '../../likes/entities/like.entity';
export const dbRootModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [Movie, Sale, Rental, Like],
  synchronize: true,
  logging: false,
});
