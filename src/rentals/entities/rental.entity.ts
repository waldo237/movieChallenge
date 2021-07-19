import { Movie } from '../../movies/entities/movie.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: false })
  customerEmail: string;

  @Column({ type: 'numeric', nullable: true })
  price: number;

  @Column({ type: 'numeric', nullable: true })
  movieId: number;
  @CreateDateColumn({})
  createdAt: Date;

  //Relationship
  @ManyToOne(() => Movie, (movie) => movie.rentals, { onDelete: 'CASCADE' })
  movie: Movie;
}
