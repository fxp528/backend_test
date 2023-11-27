import { dataStubs } from '@stubs';
import { filter, isNil, sortBy } from 'lodash';

type DataType = '優蹟' | '劣蹟'

interface FetchQuery { 
  start: Date;
  end: Date;
  dept?: string;
  user?: string; 
  type?: DataType;
}
type ListQuery = { limit?: number, page?: number, sort?: string }

interface Data { 
  date: Date;
  dept: string; 
  user: string;
  reason: string;
  type: DataType;
  count: number;
}

async function fetch(dto: FetchQuery) {
  if (!dto) {
    throw '缺少查詢項目';
  }
  if (!dto.start || !dto.end) {
    throw '缺少查詢時間';
  }
  const start = new Date(dto.start).valueOf();
  const end = new Date(dto.end).valueOf();
  const datas = dataStubs();
  return filter(datas, (data) => {
    const date = new Date(data.date).valueOf();
    return (isNil(dto.dept) ? true : data.dept === dto.dept) &&
      (isNil(dto.user) ? true : data.user === dto.user) &&
      (isNil(dto.type) ? true : data.type === dto.type) &&
      date >= start && date <= end
  })
}

async function importDatas(dto: Data[]) {
  return { success: true as true };
}

async function fetchCount(dto: FetchQuery) {
  const datas = await fetch(dto);
  return datas.length;
}

async function fetchList(dto: FetchQuery & ListQuery) {
  const { limit = 5, page = 1, sort = 'date', ...query } = dto;
  const datas = await fetch(query);
  const [, sortDir, sortParams] = sort.match(/(-)?(.+)/) as RegExpMatchArray
  const result = sortBy(datas, sortParams);
  if (sortDir === '-') {
    result.reverse();
  }
  return result.slice(limit * (page - 1), limit * page);
}

export { importDatas, fetchCount, fetchList };