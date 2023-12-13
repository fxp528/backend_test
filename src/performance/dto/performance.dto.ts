import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsString,
  IsNumber,
} from 'class-validator';
import {
  DataType,
  FetchQuery,
  ListQuery,
  Data,
} from '../interfaces/performance.interface';

export class FetchQueryDto implements FetchQuery {
  @IsDate({ message: '開始日期格式有誤' })
  @IsNotEmpty({ message: '開始日期為必填' })
  start: Date;

  @IsDate({ message: '結束日期格式有誤' })
  @IsNotEmpty({ message: '結束日期為必填' })
  end: Date;

  @IsString({ message: '督導單位格式有誤' })
  @IsOptional()
  dept?: string;

  @IsString({ message: '人員姓名格式有誤' })
  @IsOptional()
  user?: string;

  @IsIn(['優蹟', '劣蹟', null], { message: '獎懲種類格式有誤' })
  @IsOptional()
  type?: DataType;
}

export class ListQueryDto implements ListQuery {
  @IsNumber(undefined, { message: '筆數格式有誤' })
  @IsOptional()
  limit?: number;

  @IsNumber(undefined, { message: '頁數格式有誤' })
  @IsOptional()
  page?: number;

  @IsString({ message: '排序方式格式有誤' })
  @IsOptional()
  sort?: string;
}

export class DataDto implements Data {
  @IsDate({ message: '日期格式有誤' })
  @IsNotEmpty({ message: '日期為必填' })
  date: Date;

  @IsString({ message: '督導單位格式有誤' })
  @IsNotEmpty({ message: '督導單位為必填' })
  dept: string;

  @IsString({ message: '人員姓名格式有誤' })
  @IsNotEmpty({ message: '人員姓名為必填' })
  user: string;

  @IsString({ message: '督導事由格式有誤' })
  @IsNotEmpty({ message: '督導事由為必填' })
  reason: string;

  @IsIn(['優蹟', '劣蹟', null], { message: '獎懲種類格式有誤' })
  @IsNotEmpty({ message: '獎懲種類為必填' })
  type: DataType;

  @IsNumber(undefined, { message: '次數格式有誤' })
  @IsNotEmpty({ message: '次數為必填' })
  count: number;
}
