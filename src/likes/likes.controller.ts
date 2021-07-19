import { Controller, Post, Body } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeValidationPipe } from './dto/likeValidator';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Body(new LikeValidationPipe()) dto: CreateLikeDto) {
    return this.likesService.create(dto);
  }
}
