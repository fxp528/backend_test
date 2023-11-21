import mongoose from 'mongoose';
import {PerformanceRecord} from'../schema/performanceRecord.js'
import XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
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
    const workbook = XLSX.read(dto, { type: 'buffer' });
    // 獲取第一個工作表(目前指定)
    const firstSheetName = '11200';
    // console.log('firstSheetName:' + firstSheetName);
    const worksheet = workbook.Sheets[firstSheetName];
    // console.log('worksheet:' + JSON.stringify(worksheet));

    // 將工作表數據轉換為JSON對象
    const data = XLSX.utils.sheet_to_json(worksheet, {
        blankrows: false,
        // sheetRows: 1,
    });
    // console.log('data[1]:' + JSON.stringify(data[1]));
    for (let i = 0; i < data.length; i++) {
        const dateObject = new Date((data[i].日期 - 25569) * 86400 * 1000);

        // 使用 date-fns格式化日期
        data[i].日期 = format(dateObject, 'yyyy-MM-dd');

        const performanceRecord = new PerformanceRecord({
            date: data[i].日期,
            dept: data[i].督導單位,
            user: data[i].人員姓名,
            reason: data[i].督導事由,
            type: data[i].獎懲種類,
            count: data[i].次數,
        });

        try {
            const result = await performanceRecord.save();
            // console.log('result: ' + result);
        } catch (error) {
            return error;
        }
    }
    // console.log('formattedData:' + JSON.stringify(formattedData));
    return { success: true };

    // throw 'not implement'
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
    if (!dto.start || !dto.end) throw new Error('缺少查詢時間');

    let query = {};
    const startDate = new Date(dto.start);
    // 將結束日期加一天以解決最後一天無法被正確搜尋到的問題
    let endDate = new Date(dto.end);
    endDate.setDate(endDate.getDate() + 1);
    query.date = {
        $gte: startDate,
        $lte: endDate,
    };

    //處理指定分隊
    if (dto.dept) {
        // 如果 dto.dept 是Array
        if (Array.isArray(dto.dept)) {
            query.dept = {
                $in: dto.dept,
            };
        } else {
            // 如果 dto.dept 是單一值
            query.dept = dto.dept;
        }
    }

    //處理指定人物
    if (dto.user) {
        // 如果 dto.user 是Array
        if (Array.isArray(dto.user)) {
            query.user = {
                $in: dto.user,
            };
        } else {
            // 如果 dto.user 是單一值
            query.user = dto.user;
        }
    }
    const performanceRecord = await PerformanceRecord.find(query);
    return Object.keys(performanceRecord).length;
    //   throw 'not implement'
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
    let query = {};
    const pageSize = dto.limit ? dto.limit : 5; // 每頁的紀錄數
    const pageToFetch = dto.page ? dto.page : 1; // 要獲取的頁數
    const skipAmount = (pageToFetch - 1) * pageSize;
    const sortOrder = dto.sortOrder ? dto.sortOrder : 'desc';
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
        // 將結束日期加一天以解決最後一天無法被正確搜尋到的問題
        endDate.setDate(endDate.getDate() + 1);
        query.date = {
            ...query.date,
            $lte: endDate,
        };
    }

    //處理指定分隊
    if (dto.dept) {
        // 如果 dto.dept 是Array
        if (Array.isArray(dto.dept)) {
            query.dept = {
                $in: dto.dept,
            };
        } else {
            // 如果 dto.dept 是單一值
            query.dept = dto.dept;
        }
    }

    //處理指定人物
    if (dto.user) {
        // 如果 dto.user 是Array
        if (Array.isArray(dto.user)) {
            query.user = {
                $in: dto.user,
            };
        } else {
            // 如果 dto.user 是單一值
            query.user = dto.user;
        }
    }

    const performanceRecord = await PerformanceRecord.find(query)
        .sort(sortOption)
        .skip(skipAmount)
        .limit(pageSize);
    return performanceRecord;
//   throw 'not implement'
}

export { importDatas, fetchCount, fetchList };