import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceController } from './controller';
import { PerformanceService } from './service';
import {
  PerformanceRecord,
  PerformanceRecordSchema,
} from '../schema/performance-record';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PerformanceRecord.name, schema: PerformanceRecordSchema },
    ]),
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
