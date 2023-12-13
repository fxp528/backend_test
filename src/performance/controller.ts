import { Controller, Post, Body } from '@nestjs/common';
import { PerformanceService } from './service';
import { FetchQueryDto, ListQueryDto, DataDto } from './dto/performance.dto';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post('import')
  async importData(@Body() dto: DataDto[]) {
    try {
      const result = await this.performanceService.importDatas(dto);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('count')
  async fetchCount(@Body() dto: FetchQueryDto) {
    try {
      const result = await this.performanceService.fetchCount(dto);
      return { success: true, count: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('list')
  async fetchList(@Body() dto: FetchQueryDto & ListQueryDto) {
    try {
      const result = await this.performanceService.fetchList(dto);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
