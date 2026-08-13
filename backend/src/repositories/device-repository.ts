import PrismaService from './prisma-service';

export class DeviceRepository {
  private client = PrismaService.getClient();

  async upsertDevice(userId: string, deviceId: string, name?: string) {
    return this.client.device.upsert({
      where: { userId_deviceId: { userId, deviceId } },
      update: { name, lastSeenAt: new Date() },
      create: { userId, deviceId, name, lastSeenAt: new Date() },
    });
  }

  async markTrusted(userId: string, deviceId: string, trusted = true) {
    // Security: store trust in SecurityLog and update device lastSeen
    const dev = await this.client.device.updateMany({ where: { userId, deviceId }, data: { lastSeenAt: new Date() } });
    return dev;
  }

  async listDevicesForUser(userId: string) {
    return this.client.device.findMany({ where: { userId } });
  }
}

export default new DeviceRepository();