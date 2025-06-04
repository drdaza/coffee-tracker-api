import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CoffeesController],
  providers: [CoffeesService],
  imports: [AuthModule],
})
export class CoffeesModule {} 