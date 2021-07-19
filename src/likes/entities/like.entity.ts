import { Movie } from '../../movies/entities/movie.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'numeric' })
  movieId: number;

  @Column({ type: 'numeric' })
  likes: number;

  //Relationship
  @ManyToOne(() => Movie, (movie) => movie.likes, { onDelete: 'CASCADE' })
  movie: Movie;

  @Column()
  customers: string;
}
