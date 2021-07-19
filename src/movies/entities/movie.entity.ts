import { Like } from '../../likes/entities/like.entity';
import { Rental } from '../../rentals/entities/rental.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

/**
 * movie
 * •	Title, stock, rental and sales price are required
 * •	Availability by default is true
 */
@Entity()
export class Movie {
  @PrimaryGeneratedColumn('increment')
  movieId: number;

  @Column({ type: 'varchar', length: 300, unique: true, nullable: false })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric', nullable: false })
  stock: number;

  @Column({ type: 'numeric', nullable: false })
  rentalPrice: number;

  @Column({ type: 'numeric', nullable: false })
  salePrice: number;

  @Column({ default: true })
  available: boolean;

  //Relationships and foreign keys
  @OneToMany(() => Sale, (sale) => sale.movieId, {
    cascade: true,
  })
  sales: Sale[];

  @OneToMany(() => Rental, (rental) => rental.movieId, {
    cascade: true,
  })
  rentals: Rental[];

  @OneToMany(() => Like, (like) => like.movieId, {
    cascade: true,
  })
  likes: Like[];
}
