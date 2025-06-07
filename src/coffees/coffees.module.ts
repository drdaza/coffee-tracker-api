import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TastingModule } from 'src/tasting/tasting.module';

@Module({
  controllers: [CoffeesController],
  providers: [CoffeesService],
  imports: [AuthModule, TastingModule],
})
export class CoffeesModule {} 