import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { CreateSaleDto } from './create-sale.dto';

const saleVal = Joi.object({
  movieId: Joi.number().required(),
  customerEmail: Joi.string().trim().email().required(),
});

@Injectable()
export class SaleValidationPipe implements PipeTransform {
  transform(dto: CreateSaleDto) {
    const ev = saleVal.validate(dto);
    if (ev.error) {
      throw new BadRequestException(ev.error?.message);
    }
    return dto;
  }
}
