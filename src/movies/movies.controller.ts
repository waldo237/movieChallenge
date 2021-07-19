import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Put,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { movieValidatorPipe } from './dto/movieValidator.pipe';
import { readMovieDto } from './dto/read-movie.dto';
import { PaginatedMoviesDto } from './dto/PaginatedMoviesDto';
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UsePipes(new movieValidatorPipe())
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll(@Query() pageDTO: readMovieDto): Promise<PaginatedMoviesDto> {
    return this.moviesService.findAll(new readMovieDto(pageDTO));
  }

  @Put(':movieId')
  update(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body(new movieValidatorPipe()) updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(+movieId, updateMovieDto);
  }

  @Patch(':movieId')
  patch(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body(new movieValidatorPipe()) updateMovieDto: UpdateMovieDto,
  ) {
    //functionality already exist in update
    return this.update(movieId, updateMovieDto);
  }

  @Delete(':movieId')
  remove(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.moviesService.remove(+movieId);
  }
}
