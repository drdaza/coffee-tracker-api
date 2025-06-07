import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TastingService } from './tasting.service';
import { CreateTastingDto } from './dto/create-tasting.dto';
import { UpdateTastingDto } from './dto/update-tasting.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('tasting')
export class TastingController {
  constructor(private readonly tastingService: TastingService) {}

  @Post(':coffeeId')
  @Auth()
  create(@Body() createTastingDto: CreateTastingDto, @GetUser() user: any, @Param('coffeeId') coffeeId: string) {
    return this.tastingService.create(createTastingDto, coffeeId, user.id || '');
  }

  @Get()
  @Auth()
  findAll() {
    return this.tastingService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.tastingService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateTastingDto: UpdateTastingDto) {
    return this.tastingService.update(id, updateTastingDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.tastingService.remove(id);
  }
}
