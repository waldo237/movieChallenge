import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
export class TransctionParamDto {
  movieId: number;
  from: string;
  to: string;
}

export const validator = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
});

@Injectable()
export class TranstactionPipe implements PipeTransform {
  transform(params: TransctionParamDto): TransctionParamDto {

    if (!params.from || !params.to) {
      throw new BadRequestException('missing parameter');
    }
    if (!Date.parse(params.from) || !Date.parse(params.from)) {
      throw new BadRequestException(' from or to date is not valid.');
    }
    const ev = validator.validate(params);

    if (ev.error) {
      throw new BadRequestException(ev.error.message);
    }
    params.from = new Date(params.from).toISOString();
    params.to = new Date(params.to).toISOString();

    return params;
  }
}
