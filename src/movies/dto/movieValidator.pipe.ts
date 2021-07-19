import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { CreateMovieDto } from './create-movie.dto';

/**
 * Object that enforces rules for movies
 * •	Title, stock, rental and sales price are required
 * •	Availability by default is true
 */
export const validator = Joi.object({
  title: Joi.string().max(300).required().trim(),
  description: Joi.string().trim(),
  stock: Joi.number().default(0).min(0).required(),
  rentalPrice: Joi.number().min(0).required(),
  salePrice: Joi.number().min(0).required(),
  available: Joi.boolean().default(true),
});

@Injectable()
export class movieValidatorPipe implements PipeTransform {
  transform(dto: CreateMovieDto) {
    const ev = validator.validate(dto);
    if (ev.error) {
      throw new BadRequestException(ev.error?.message);
    }
    return dto;
  }
}
