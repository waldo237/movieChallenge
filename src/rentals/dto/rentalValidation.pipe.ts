import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { CreateRentalDto } from './create-rental.dto';

const validator = Joi.object({
  movieId: Joi.number().required(),
  customerEmail: Joi.string().trim().email().required(),
});

@Injectable()
export class RentalValidationPipe implements PipeTransform {
  transform(dto: CreateRentalDto) {
    console.log(`dtorental`, dto);
    const ev = validator.validate(dto);
    if (ev.error) {
      throw new BadRequestException(ev.error?.message);
    }
    return dto;
  }
}
