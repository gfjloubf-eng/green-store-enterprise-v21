import BaseRepository from './base-repository';
import type { Notification } from '@prisma/client';
import { NotFoundException } from './exceptions';

export class NotificationRepository extends BaseRepository {
  constructor() {
    super('notification');
  }

  async createNotification(data: {
    userId: string;
    title: string;
    body: string;
    channel?: string;
    payload?: any;
  }): Promise<Notification> {
    return this.client.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        body: data.body,
        channel: data.channel ?? 'SYSTEM',
        read: false,
        payload: data.payload ? JSON.stringify(data.payload) : null,
      },
    });
  }

  async findUserNotifications(userId: string, limit = 30) {
    const [items, unreadCount] = await Promise.all([
      this.client.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      this.client.notification.count({
        where: { userId, read: false },
      }),
    ]);

    return {
      items,
      unreadCount,
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.client.notification.count({
      where: { userId, read: false },
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const existing = await this.client.notification.findUnique({
      where: { id: notificationId },
    });

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('notification_not_found');
    }

    return this.client.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.client.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return result.count;
  }
}

export default NotificationRepository;
