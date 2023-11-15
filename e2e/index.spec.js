import { jest, expect } from '@jest/globals';
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.test') })
import { connectDB } from '../src/db.js';
import axios from 'axios';
import { dataStubs } from './stubs/index.js';
import _ from 'lodash';
import { MongoClient } from 'mongodb';

const { filter, sortBy } = _;

if (process.env.USE_MOCK === 'true') {
  /**
   * 測試展示用資料
   */
  console.info('USE MOCK');
  jest.mock('../src/controllers/index.js');
  jest.mock('mongoose');
} else {
  let dbClient;
  beforeAll(async () => {
    /** 移除舊的測試資料 */
    dbClient = await MongoClient.connect(process.env.MONGO_URI);
    const db = dbClient.db(process.env.MONGO_DB);
    const collectionName = process.env.MONGO_COLLECTION + 's';
    const collections = await db.collections();
    if (collections.findIndex((value) => value.collectionName === collectionName) !== -1) {
      await db.collection(collectionName).drop();
    }
  })
  afterAll(async () => {
    await dbClient.close();
  })
}

axios.defaults.baseURL = `http://127.0.0.1:${process.env.PORT}`;

describe('Backend_test 測試', () => {
  let server, dbConnection, spyImportDatas;
  const datas = dataStubs();
  beforeAll(async () => {
    dbConnection = await connectDB(process.env.MONGO_URI, process.env.MONGO_DB);
    const app = (await import('../src/app.js')).default;
    server = app.listen(process.env.PORT);
    const appController = await import('../src/controllers/index.js');
    spyImportDatas = jest.spyOn(appController, 'importDatas');
  });
  afterAll(async () => {
    await dbConnection.close();
    server.close();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('伺服器healthcheck', () => {
    it('GET /heathcheck 應回傳 db: 1 (connected)', async () => {
      expect.assertions(3);
      try {
        const res = await axios.get('/healthcheck');
        expect(res.status).toBe(200);
        const data = res.data;
        expect(data).toBeDefined();
        expect(data.db).toBe(1);
      } catch (error) {
        console.error(error.response?.data || error);
        throw error;
      }
    });
  });

  describe('匯入資料', () => {
    it('POST /api/app/import 應回傳 success: true', async () => {
      expect.assertions(5);
      try {
        const res = await axios.post('/api/app/import', datas);
        expect(res.status).toBe(200);
        const data = res.data;
        expect(data).toBeDefined();
        expect(data.success).toBe(true);
      } catch (error) {
        console.error(error.response?.data || error);
        throw error;
      } finally {
        expect(spyImportDatas).toBeCalledTimes(1);
        expect(spyImportDatas).toBeCalledWith(datas);
      }
    });
  });

  describe('查詢資料', () => {
    it('POST /api/app/count 缺少查詢時間應報錯', async () => {
      expect.assertions(2);
      try {
        await axios.post('/api/app/count', {});
      } catch (error) {
        expect(error.response?.status).toBe(400);
        const data = error.response?.data;
        expect(data.msg).toContain('缺少查詢時間');
      }
    });

    it('POST /api/app/count 查詢全體上半年資料筆數', async () => {
      expect.assertions(1);
      const start = new Date(2023, 0, 1).toISOString();
      const end = new Date(2023, 5, 30).toISOString();
      const stubs = filter(datas, (data) => {
        const date = new Date(data.date).toISOString();
        return date >= start && date <= end;
      })
      try {
        const res = await axios.post('/api/app/count', { start, end });
        const data = res.data;
        expect(data).toBe(stubs.length);
      } catch (error) {
        console.error(error.response?.data || error);
        throw error;
      }
    });

    it('POST /api/app/list 查詢全體上半年資料時間降序排列前五筆', async () => {
      expect.assertions(2);
      const start = new Date(2023, 0, 1).toISOString();
      const end = new Date(2023, 5, 30).toISOString();
      const stubs = sortBy(filter(datas, (data) => {
        const date = new Date(data.date).toISOString();
        return date >= start && date <= end;
      }), 'date');
      stubs.reverse() // 由大到小需顛倒
      try {
        const res = await axios.post('/api/app/list', { start, end, limit: 5, page: 1, sort: '-date' });
        const data = res.data;
        expect(data.length).toBe(5);
        expect(data).toEqual(expect.arrayContaining(stubs.slice(0, 5).map((v) => expect.objectContaining(v))));
      } catch (error) {
        console.error(error.response?.data || error);
        throw error;
      }
    });

    it('POST /api/app/count 查詢小北分隊下半年資料筆數', async () => {
      expect.assertions(1);
      const start = new Date(2023, 6, 1).toISOString();
      const end = new Date(2023, 12, 31).toISOString();
      const stubs = filter(datas, (data) => {
        const date = new Date(data.date).toISOString();
        return date >= start && date <= end && data.dept === '小北分隊';
      })
      try {
        const res = await axios.post('/api/app/count', { start, end, dept: '小北分隊' });
        const data = res.data;
        expect(data).toBe(stubs.length);
      } catch (error) {
        console.error(error.response?.data || error);
        throw error;
      }
    });

    let userDataCount;
    it('POST /api/app/count 查詢張大大下半年資料筆數', async () => {
      expect.assertions(1);
      const start = new Date(2023, 6, 1).toISOString();
      const end = new Date(2023, 12, 31).toISOString();
      const stubs = filter(datas, (data) => {
        const date = new Date(data.date).toISOString();
        return date >= start && date <= end && data.user === '張大大';
      })
      try {
        const res = await axios.post('/api/app/count', { start, end, user: '張大大' });
        const data = res.data;
        expect(data).toBe(stubs.length);
        userDataCount = data;
      } catch (error) {
        console.error(error.response?.data || error);
        throw error;
      }
    });

    it('POST /api/app/count 查詢張大大在小北分隊下半年資料筆數，筆數應小於前一次所有單位結果', async () => {
      expect.assertions(2);
      const start = new Date(2023, 6, 1).toISOString();
      const end = new Date(2023, 12, 31).toISOString();
      const stubs = filter(datas, (data) => {
        const date = new Date(data.date).toISOString();
        return date >= start && date <= end && data.user === '張大大' && data.dept === '小北分隊';
      })
      try {
        const res = await axios.post('/api/app/count', { start, end, user: '張大大', dept: '小北分隊' });
        const data = res.data;
        expect(data).toBe(stubs.length);
        expect(data).toBeLessThan(userDataCount);
      } catch (error) {
        console.error(error.response?.data || error);
        throw error;
      }
    });

    it('POST /api/app/list 查詢東西分隊下半年資料，預設排序(時間升序)每頁3筆第2頁', async () => {
      expect.assertions(1);
      const start = new Date(2023, 6, 1).toISOString();
      const end = new Date(2023, 12, 31).toISOString();
      const stubs = filter(datas, (data) => {
        const date = new Date(data.date).toISOString();
        return date >= start && date <= end && data.dept === '東西分隊';
      })
      try {
        const res = await axios.post('/api/app/list', { start, end, dept: '東西分隊', limit: 3, page: 2 });
        const data = res.data;
        expect(data).toEqual(expect.arrayContaining(stubs.slice(3 * 1, 3 * 2).map((v) => expect.objectContaining(v))));
      } catch (error) {
        console.error(error.response?.data || error);
        throw error;
      }
    });

  });
});