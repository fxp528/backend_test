import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceModule } from './performance/module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI + process.env.MONGO_DB),
    PerformanceModule,
  ],
})
export class AppModule {}
