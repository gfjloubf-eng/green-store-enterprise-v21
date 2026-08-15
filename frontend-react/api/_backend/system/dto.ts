export interface HealthResponseDto {
  readonly status: 'ok';
  readonly version: string;
  readonly timestamp: string;
  readonly uptime: number;
  readonly environment: string;
  readonly database: 'ready';
  readonly application: 'ready';
  readonly service: 'ready';
}

export interface ReadyResponseDto {
  readonly application: boolean;
  readonly database: boolean;
  readonly services: boolean;
  readonly configuration: boolean;
}

export interface LiveResponseDto {
  readonly status: 'alive';
  readonly timestamp: string;
}

export interface VersionResponseDto {
  readonly applicationName: string;
  readonly version: string;
  readonly buildNumber: string;
  readonly apiVersion: string;
  readonly buildDate: string;
}
