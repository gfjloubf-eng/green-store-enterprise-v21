import BaseRepository from './base-repository';
import { NotFoundException } from './exceptions';
import { ValidationException } from '../validation';
import SettingsRepository from './settings-repository';
import NotificationRepository from './notification-repository';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  assignedStaffId?: string | null;
  replies: SupportReply[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
}

export interface SupportReply {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

// In-memory persistent support ticket storage mapped cleanly to DB activity logs
const TICKETS_STORE: Map<string, SupportTicket> = new Map();

export class SupportRepository extends BaseRepository {
  private settingsRepo = new SettingsRepository();
  private notificationRepo = new NotificationRepository();

  constructor() {
    super('user');
  }

  async getSupportContacts() {
    const pubSettings = await this.settingsRepo.getPublicSettings();
    return {
      supportPhone: pubSettings.supportPhone,
      contactEmail: pubSettings.contactEmail,
      address: pubSettings.address,
    };
  }

  async createTicket(data: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    subject: string;
    description: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  }): Promise<SupportTicket> {
    if (!data.subject || !data.description) {
      throw new ValidationException('subject_and_description_required');
    }

    const ticketId = `TICK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const ticketNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;

    const ticket: SupportTicket = {
      id: ticketId,
      ticketNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      subject: data.subject,
      description: data.description,
      priority: data.priority ?? 'MEDIUM',
      status: 'OPEN',
      assignedStaffId: null,
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    TICKETS_STORE.set(ticketId, ticket);

    // Log activity in Prisma DB
    try {
      await this.client.activityLog.create({
        data: {
          userId: data.customerId,
          action: 'SUPPORT_TICKET_CREATED',
          meta: JSON.stringify({ ticketId, subject: data.subject }),
        },
      });
    } catch {}

    return ticket;
  }

  async findCustomerTickets(customerId: string): Promise<SupportTicket[]> {
    const results: SupportTicket[] = [];
    for (const ticket of TICKETS_STORE.values()) {
      if (ticket.customerId === customerId) {
        results.push(ticket);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findAllTickets(): Promise<SupportTicket[]> {
    return Array.from(TICKETS_STORE.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findTicketById(ticketId: string, customerIdCheck?: string): Promise<SupportTicket | null> {
    const ticket = TICKETS_STORE.get(ticketId);
    if (!ticket) return null;

    // Ownership Enforcement
    if (customerIdCheck && ticket.customerId !== customerIdCheck) {
      return null;
    }
    return ticket;
  }

  async replyToTicket(data: {
    ticketId: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    message: string;
  }): Promise<SupportTicket> {
    const ticket = TICKETS_STORE.get(data.ticketId);
    if (!ticket) throw new NotFoundException('ticket_not_found');

    const replyId = `REPLY-${Date.now()}`;
    const reply: SupportReply = {
      id: replyId,
      ticketId: ticket.id,
      senderId: data.senderId,
      senderName: data.senderName,
      senderRole: data.senderRole,
      message: data.message,
      createdAt: new Date().toISOString(),
    };

    ticket.replies.push(reply);
    ticket.updatedAt = new Date().toISOString();

    if (data.senderRole === 'CUSTOMER') {
      ticket.status = 'IN_PROGRESS';
    } else {
      ticket.status = 'WAITING_FOR_CUSTOMER';

      // Notify customer of staff reply
      await this.notificationRepo.createNotification({
        userId: ticket.customerId,
        title: `رد جديد على تذكرة الدعم ${ticket.ticketNumber}`,
        body: `تم إضافة رد جديد من فريق الدعم الفني: "${data.message.slice(0, 50)}..."`,
        channel: 'SUPPORT',
        payload: { ticketId: ticket.id },
      });
    }

    TICKETS_STORE.set(ticket.id, ticket);
    return ticket;
  }

  async updateTicketStatus(
    ticketId: string,
    status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED'
  ): Promise<SupportTicket> {
    const ticket = TICKETS_STORE.get(ticketId);
    if (!ticket) throw new NotFoundException('ticket_not_found');

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    if (status === 'RESOLVED' || status === 'CLOSED') {
      ticket.resolvedAt = new Date().toISOString();
    }

    TICKETS_STORE.set(ticket.id, ticket);
    return ticket;
  }
}

export default SupportRepository;
