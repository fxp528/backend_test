import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<PerformanceRecord>;

@Schema()
export class PerformanceRecord {
  @Prop({ type: Date, required: [true, '日期必填'] })
  date: Date;

  @Prop({ type: String, required: [true, '督導單位必填'] })
  dept: string;

  @Prop({ type: String, required: [true, '人員姓名必填'] })
  user: string;

  @Prop({ type: String, required: [true, '督導事由必填'] })
  reason: string;

  @Prop({
    type: String,
    enum: ['優蹟', '劣蹟'],
    required: [true, '獎懲種類必填'],
  })
  type: string;

  @Prop({ type: Number, required: [true, '次數必填'] })
  count: number;
}

export const PerformanceRecordSchema =
  SchemaFactory.createForClass(PerformanceRecord);
