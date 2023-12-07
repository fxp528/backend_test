import { Controller, Post, Body } from '@nestjs/common';
import { PerformanceService } from './service';

type DataType = '優蹟' | '劣蹟';

interface FetchQuery {
  start: Date;
  end: Date;
  dept?: string;
  user?: string;
  type?: DataType;
}
type ListQuery = { limit?: number; page?: number; sort?: string };

interface Data {
  date: Date;
  dept: string;
  user: string;
  reason: string;
  type: DataType;
  count: number;
}

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post('import')
  async importData(@Body() dto: Data[]) {
    try {
      const result = await this.performanceService.importDatas(dto);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('count')
  async fetchCount(@Body() dto: FetchQuery) {
    try {
      const result = await this.performanceService.fetchCount(dto);
      return { success: true, count: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('list')
  async fetchList(@Body() dto: FetchQuery & ListQuery) {
    try {
      const result = await this.performanceService.fetchList(dto);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
