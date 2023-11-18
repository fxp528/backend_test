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
  throw 'not implement'
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
  throw 'not implement'
}

export { importDatas, fetchCount, fetchList };