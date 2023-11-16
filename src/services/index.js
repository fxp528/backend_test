import mongoose from 'mongoose';
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
  console.log('fimportDatas');
  const performanceRecordSchema = mongoose.Schema({
      date: Date,
      dept: String,
      user: String,
      reason: String,
      type: {
          type: String,
          enum: ['優蹟', '劣蹟'],
      },
      count: Number,
  });
  const PerformanceRecord = mongoose.model(
      'PerformanceRecord',
      performanceRecordSchema
  );

  const performanceRecord = new PerformanceRecord({
      date: Date.now(),
      dept: '123',
      user: 'me',
      reason: 'run',
      type: '優蹟',
      count: 1,
  });

  // console.log(performanceRecord);
  // const result = await performanceRecord.save();
  // console.log(result);


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