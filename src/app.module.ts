import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CoffeesModule } from './coffees/coffees.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { envs } from './config/envs';
import { TastingModule } from './tasting/tasting.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    UsersModule, 
    CoffeesModule, 
    AuthModule, TastingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
