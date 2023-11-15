import { jest } from '@jest/globals';
const mockController = jest.createMockFromModule('../index.js');
import { dataStubs } from '../../../e2e/stubs/index.js';
import _ from 'lodash';
const { filter, isNil, sortBy } = _;

async function fetch(dto) {
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
  });
}

/**
 * 
 * @param { { 
*  date: Date, 
*  dept: string, 
*  user: string, 
*  reason: string,
*  type: '優蹟' | '劣蹟',
*  count: number
* }[] } dto 
* @return { Promise<{ success: true }> }
*/
async function importDatas(dto) {
  return { success: true };
}
mockController.importDatas = importDatas;

/**
 * 
 * @param { { 
*  start: Date, 
*  end: Date, 
*  dept?: string, 
*  user?: string, 
*  type?: '優蹟' | '劣蹟'
*  } } dto
* @return { Promise<number> }
*/
async function fetchCount(dto) {
  const datas = await fetch(dto);
  return datas.length;
}
mockController.fetchCount = fetchCount;

/**
 * 
 * @param { { 
*  start: Date, 
*  end: Date, 
*  dept?: string, 
*  user?: string, 
*  type?: '優蹟' | '劣蹟',
*  limit?: number,
*  page?: number,
*  sort?: string
*  } } dto { limit = 5, page = 1, sort = 'date' }
* @return { Promise<{
*  date: Date, 
*  dept: string, 
*  user: string, 
*  reason: string,
*  type: '優蹟' | '劣蹟',
*  count: number
* }[]> }
*/
async function fetchList(dto) {
  const { limit = 5, page = 1, sort = 'date', ...query } = dto;
  const datas = await fetch(query);
  const [, sortDir, sortParams] = sort.match(/(-)?(.+)/)
  const result = sortBy(datas, sortParams);
  if (sortDir === '-') {
    result.reverse();
  }
  return result.slice(limit * (page - 1), limit * page);
}
mockController.fetchList = fetchList;

module.exports = mockController;