import { Controller, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleValidationPipe } from './dto/salesValidator.pipe';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body(new SaleValidationPipe()) createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }
}
