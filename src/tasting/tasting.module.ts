import { Module } from '@nestjs/common';
import { TastingService } from './tasting.service';
import { TastingController } from './tasting.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TastingController],
  providers: [TastingService],
  imports: [AuthModule],
  exports: [TastingService],
})
export class TastingModule {}
