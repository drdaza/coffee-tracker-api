import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UsersModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ScheduleModule.forRoot()
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
