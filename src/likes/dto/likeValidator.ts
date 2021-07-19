import * as Joi from 'joi';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateLikeDto } from './create-like.dto';

const likeValidator = Joi.object({
  movieId: Joi.number().required(),
  customerEmail: Joi.string().trim().email().required(),
});

@Injectable()
export class LikeValidationPipe implements PipeTransform {
  transform(dto: CreateLikeDto) {
    const ev = likeValidator.validate(dto);
    if (ev.error) {
      throw new BadRequestException(ev.error?.message);
    }
    return dto;
  }
}
