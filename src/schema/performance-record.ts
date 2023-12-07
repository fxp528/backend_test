import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<PerformanceRecord>;

@Schema()
export class PerformanceRecord {
  @Prop({ type: Date })
  date: Date;

  @Prop()
  dept: string;

  @Prop()
  user: string;

  @Prop()
  reason: string;

  @Prop({ type: String, enum: ['優蹟', '劣蹟'] })
  type: string;

  @Prop()
  count: number;
}

export const PerformanceRecordSchema =
  SchemaFactory.createForClass(PerformanceRecord);
