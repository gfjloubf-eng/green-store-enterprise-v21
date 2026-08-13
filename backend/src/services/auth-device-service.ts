import DeviceRepository from '../repositories/device-repository';

export interface DeviceRecord {
  deviceId: string;
  userId: string;
  name?: string;
  lastSeenAt?: Date;
  trusted?: boolean;
}

export class DeviceService {
  private repo = DeviceRepository;

  async registerDevice(userId: string, deviceId: string, name?: string, trusted = false): Promise<any> {
    return this.repo.upsertDevice(userId, deviceId, name);
  }

  async getDevice(deviceId: string): Promise<any | null> {
    // This implementation expects listDevicesForUser to be called with userId in real callers.
    const devices = await this.repo.listDevicesForUser('');
    return devices.find((d: any) => d.deviceId === deviceId) ?? null;
  }

  async markTrusted(deviceId: string, trusted = true): Promise<void> {
    // Schema has no trusted column; markTrusted updates lastSeen. Trust decisions stored in SecurityLog by higher layer.
    await this.repo.markTrusted('', deviceId, trusted);
  }

  async listDevicesForUser(userId: string): Promise<any[]> {
    return this.repo.listDevicesForUser(userId);
  }
}

export default new DeviceService();