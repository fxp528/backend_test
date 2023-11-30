import { PerformanceRecord } from '../schema/performanceRecord'
import { FilterQuery } from 'mongoose';

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

async function importDatas(dto: Data[]) {
    let data: Data[];
    if (Array.isArray(dto)) {
        data = dto;
    } else {
        data = [dto];
    }

    for (let i = 0; i < data.length; i++) {
        const performanceRecord = new PerformanceRecord({
            date: data[i].date,
            dept: data[i].dept,
            user: data[i].user,
            reason: data[i].reason,
            type: data[i].type,
            count: data[i].count,
        });

        try {
            const result = await performanceRecord.save();
        } catch (error) {
            return error;
        }
    }
    return { success: true };
}

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
async function fetchCount(dto: FetchQuery) {
    if (!dto) {
        throw '缺少查詢項目';
    }
    if (!dto.start || !dto.end) throw '缺少查詢時間';

    let query: FilterQuery<Data> = {};
    const startDate = new Date(dto.start);
    let endDate = new Date(dto.end);
    query.date = {
        $gte: startDate,
        $lte: endDate,
    };

    //處理指定分隊
    if (dto.dept) {
        if (typeof dto.dept === 'string') {
            query.dept = dto.dept;
        } else {
            throw '所查詢分隊格式錯誤'
        }
    }

    //處理指定人物
    if (dto.user) {
        if (typeof dto.user === 'string') {
            query.user = dto.user;
        } else {
            throw '所查詢人物格式錯誤'
        }
    }
    const performanceRecordCount = await PerformanceRecord.countDocuments(query);

    return performanceRecordCount;
}

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
async function fetchList(dto: FetchQuery & ListQuery) {
    if (!dto.start || !dto.end) throw '缺少查詢時間';
    let query: FilterQuery<Data> = {};
    const pageSize = dto.limit ? dto.limit : 5; // 每頁的紀錄數
    const pageToFetch = dto.page ? dto.page : 1; // 要獲取的頁數
    const skipAmount = (pageToFetch - 1) * pageSize;
    const sortOption: string = dto.sort ? dto.sort : 'date';

    //處理日期
    if (dto.start) {
        const startDate = new Date(dto.start);
        query.date = {
            $gte: startDate,
        };
    }
    if (dto.end) {
        let endDate = new Date(dto.end);
        query.date = {
            ...query.date,
            $lte: endDate,
        };
    }

    //處理指定分隊
    if (dto.dept) {
        if (typeof dto.dept === 'string') {
            query.dept = dto.dept;
        } else {
            throw '所查詢分隊格式錯誤'
        }
    }

    //處理指定人物
    if (dto.user) {
        if (typeof dto.user === 'string') {
            query.user = dto.user;
        } else {
            throw '所查詢人物格式錯誤'
        }
    }

    const performanceRecord = await PerformanceRecord.find(query)
        .sort(sortOption)
        .skip(skipAmount)
        .limit(pageSize)
        .select('-__v -_id');
    return performanceRecord;
}

export { importDatas, fetchCount, fetchList };