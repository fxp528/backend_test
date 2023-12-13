export type DataType = '優蹟' | '劣蹟';

export interface FetchQuery {
  start: Date;
  end: Date;
  dept?: string;
  user?: string;
  type?: DataType;
}
export type ListQuery = { limit?: number; page?: number; sort?: string };

export interface Data {
  date: Date;
  dept: string;
  user: string;
  reason: string;
  type: DataType;
  count: number;
}
