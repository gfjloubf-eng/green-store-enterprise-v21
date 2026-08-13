import { startSystemServer } from './system/server';

export * from './api';
export * from './authorization';
export * as controllers from './controllers';
export * from './dto';
export * from './middleware';
export * from './rbac';
export * from './routes';
export * from './route-protection';
export * from './system';
export * from './tenant-isolation';
export * from './validation';

if (require.main === module) {
  startSystemServer();
}
