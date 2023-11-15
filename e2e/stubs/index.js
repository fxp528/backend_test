function date(month, date) {
  return new Date(2023, month, date).toISOString();
}

export const dataStubs = () => ([
  { date: date(4, 6), dept: '小北分隊', user: '張大大', reason: '未簽到', type: '劣蹟', count: 1 },
  { date: date(4, 10), dept: '小北分隊', user: '黃三郎', reason: '缺席', type: '劣蹟', count: 2 },
  { date: date(5, 1), dept: '東西分隊', user: '王小明', reason: '工作認真', type: '優蹟', count: 2 },
  { date: date(5, 9), dept: '東西分隊', user: '王小明', reason: '火災搶救', type: '優蹟', count: 2 },
  { date: date(5, 10), dept: '小北分隊', user: '張大大', reason: '工作認真', type: '優蹟', count: 1 },
  { date: date(5, 15), dept: '東西分隊', user: '陳天翔', reason: '未簽到', type: '劣蹟', count: 1 },
  { date: date(6, 1), dept: '小北分隊', user: '黃三郎', reason: '缺席', type: '劣蹟', count: 2 },
  { date: date(7, 6), dept: '小北分隊', user: '張大大', reason: '缺席', type: '劣蹟', count: 1 },
  { date: date(7, 16), dept: '小北分隊', user: '張大大', reason: '缺席', type: '劣蹟', count: 1 },
  { date: date(8, 8), dept: '東西分隊', user: '王小明', reason: '工作認真', type: '優蹟', count: 2 },
  { date: date(9, 1), dept: '東西分隊', user: '王小明', reason: '任務達標', type: '優蹟', count: 3 },
  { date: date(9, 1), dept: '東西分隊', user: '陳天翔', reason: '火災搶救', type: '優蹟', count: 2 },
  { date: date(9, 10), dept: '小北分隊', user: '黃三郎', reason: '缺席', type: '劣蹟', count: 3 },
  { date: date(10, 3), dept: '東西分隊', user: '張大大', reason: '工作認真', type: '優蹟', count: 1 },
  { date: date(10, 5), dept: '東西分隊', user: '王小明', reason: '任務達標', type: '優蹟', count: 3 },
  { date: date(10, 7), dept: '小北分隊', user: '黃三郎', reason: '工作認真', type: '優蹟', count: 1 },
  { date: date(10, 9), dept: '東西分隊', user: '王小明', reason: '火災搶救', type: '優蹟', count: 2 },
  { date: date(10, 22), dept: '東西分隊', user: '陳天翔', reason: '工作認真', type: '優蹟', count: 1 },
  { date: date(11, 10), dept: '東西分隊', user: '張大大', reason: '任務達標', type: '優蹟', count: 4 },
  { date: date(11, 13), dept: '東西分隊', user: '王小明', reason: '未簽到', type: '劣蹟', count: 1 },
  { date: date(11, 20), dept: '小北分隊', user: '黃三郎', reason: '工作認真', type: '優蹟', count: 1 },
  { date: date(11, 31), dept: '東西分隊', user: '陳天翔', reason: '缺席', type: '劣蹟', count: 3 },
])