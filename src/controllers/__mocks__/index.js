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

function importData(_req, res, _next) {
  return res.json({ success: true });
}
mockController.importData = importData;

async function fetchCount(req, res) {
  try {
    const datas = await fetch(req.body);
    return res.json(datas.length);
  } catch (error) {
    return res.status(400).json({ msg: error })
  }
}
mockController.fetchCount = fetchCount;

async function fetchList(req, res, _next) {
  const { limit = 5, page = 1, sort = 'date', ...query } = req.body;
  try {
    const datas = await fetch(query);
    const [, sortDir, sortParams] = sort.match(/(-)?(.+)/)
    const result = sortBy(datas, sortParams);
    if (sortDir === '-') {
      result.reverse();
    }
    return res.json(result.slice(limit * (page - 1), limit * page));
  } catch (error) {
    return res.status(400).json({ msg: error })
  }
}
mockController.fetchList = fetchList;

module.exports = mockController;