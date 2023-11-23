import {PerformanceRecord} from'../schema/performanceRecord.js'

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
    let data;
    if (Array.isArray(dto)) {
        data = dto;
    }

    for (let i = 0; i < data.length; i++) {
        const performanceRecord = new PerformanceRecord({
            date: data[i].日期 ? data[i].日期 : data[i].date,
            dept: data[i].督導單位 ? data[i].督導單位 : data[i].dept,
            user: data[i].人員姓名 ? data[i].人員姓名 : data[i].user,
            reason: data[i].督導事由 ? data[i].督導事由 : data[i].reason,
            type: data[i].獎懲種類 ? data[i].獎懲種類 : data[i].type,
            count: data[i].次數 ? data[i].次數 : data[i].count,
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
async function fetchCount(dto) {
    if (!dto.start || !dto.end) throw '缺少查詢時間';

    let query = {};
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
async function fetchList(dto) {
    if (!dto.start || !dto.end) throw '缺少查詢時間';
    let query = {};
    const pageSize = dto.limit ? dto.limit : 5; // 每頁的紀錄數
    const pageToFetch = dto.page ? dto.page : 1; // 要獲取的頁數
    const skipAmount = (pageToFetch - 1) * pageSize;
    const sortOrder = dto.sort ? dto.sort : 'asc';
    let sortOption = {};
    sortOption['date'] = sortOrder === 'asc' ? 1 : -1;

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