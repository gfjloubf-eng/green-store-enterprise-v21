import { success } from '../api';
import type { ApiMeta, ApiResponse } from '../api';
import type { ControllerRequest } from '../controllers';
import { SystemHealthService } from './service';
import type { HealthResponseDto, LiveResponseDto, ReadyResponseDto, VersionResponseDto } from './dto';

export class SystemController {
  constructor(private readonly service: SystemHealthService = new SystemHealthService()) {}

  public getHealth(): ApiResponse<HealthResponseDto> {
    return success(this.service.getHealth(), this.createApiContext());
  }

  public getReady(): ApiResponse<ReadyResponseDto> {
    return success(this.service.getReady(), this.createApiContext());
  }

  public getLive(): ApiResponse<LiveResponseDto> {
    return success(this.service.getLive(), this.createApiContext());
  }

  public getVersion(): ApiResponse<VersionResponseDto> {
    return success(this.service.getVersion(), this.createApiContext());
  }

  private createApiContext(): Pick<ApiMeta, 'timestamp' | 'requestId' | 'version' | 'locale'> {
    return {
      timestamp: new Date().toISOString(),
      version: 'v1',
    };
  }
}
