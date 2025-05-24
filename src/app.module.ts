import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CoffeesModule } from './coffees/coffees.module';


@Module({
  imports: [UsersModule, CoffeesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
