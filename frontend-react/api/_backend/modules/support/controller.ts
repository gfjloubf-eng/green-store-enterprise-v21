import { HTTP_STATUS, success, created } from '../../api';
import type { ApiMeta, ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { UnauthorizedError } from '../../common/security/errors';
import { ValidationException } from '../../validation';
import { NotFoundException } from '../../repositories/exceptions';
import { SupportRepository } from '../../repositories/support-repository';
import CartRepository from '../../repositories/cart-repository';

type ApiContextFields = Pick<ApiMeta, 'timestamp' | 'requestId' | 'version' | 'locale'>;

export class SupportController {
  private supportRepo = new SupportRepository();
  private cartRepo = new CartRepository();

  public async getSupportContacts(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    try {
      const contacts = await this.supportRepo.getSupportContacts();
      return success(contacts, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async createTicket(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const body = request.body || {};
      const { subject, description, priority } = body;

      if (!subject || !description) {
        return this.errorResponse('bad_request', 'subject_and_description_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const ticket = await this.supportRepo.createTicket({
        customerId: user.id,
        customerName: user.displayName || user.name || user.email,
        customerEmail: user.email,
        subject: String(subject),
        description: String(description),
        priority: priority ? String(priority) as any : 'MEDIUM',
      });

      return created(ticket, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async listTickets(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const isStaffOrAdmin = this.isSupportStaff(user);
      let tickets;
      if (isStaffOrAdmin) {
        tickets = await this.supportRepo.findAllTickets();
      } else {
        tickets = await this.supportRepo.findCustomerTickets(user.id);
      }

      return success({ tickets }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async getTicketById(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const ticketId = request.params?.id;
      if (!ticketId) {
        return this.errorResponse('bad_request', 'ticket_id_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const isStaffOrAdmin = this.isSupportStaff(user);
      const ticket = await this.supportRepo.findTicketById(
        ticketId,
        isStaffOrAdmin ? undefined : user.id
      );

      if (!ticket) {
        return this.errorResponse('not_found', 'ticket_not_found', HTTP_STATUS.NOT_FOUND, ctx);
      }

      return success(ticket, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async replyTicket(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const ticketId = request.params?.id;
      const message = request.body?.message;

      if (!ticketId || !message) {
        return this.errorResponse('bad_request', 'ticket_id_and_message_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const isStaffOrAdmin = this.isSupportStaff(user);
      const ticketCheck = await this.supportRepo.findTicketById(ticketId, isStaffOrAdmin ? undefined : user.id);
      if (!ticketCheck) {
        return this.errorResponse('not_found', 'ticket_not_found', HTTP_STATUS.NOT_FOUND, ctx);
      }

      const updated = await this.supportRepo.replyToTicket({
        ticketId,
        senderId: user.id,
        senderName: user.displayName || user.name || user.email,
        senderRole: user.role ?? 'CUSTOMER',
        message: String(message),
      });

      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async updateTicketStatus(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const ticketId = request.params?.id;
      const status = request.body?.status;

      if (!this.isSupportStaff(user)) {
        return this.errorResponse('forbidden', 'support_staff_required', 403, ctx);
      }

      if (!ticketId || !status) {
        return this.errorResponse('bad_request', 'ticket_id_and_status_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const updated = await this.supportRepo.updateTicketStatus(ticketId, status);
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  private isSupportStaff(user: any): boolean {
    const role = String(user?.role ?? '').trim().toUpperCase();
    return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'STAFF'].includes(role);
  }

  private createApiContext(request: ControllerRequest): ApiContextFields {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as ApiMeta['version'],
      locale: request.context?.metadata?.locale,
    };
  }

  private mapError(error: unknown, ctx: ApiContextFields): ApiResponse<never> {
    if (error instanceof NotFoundException) {
      return this.errorResponse('not_found', error.message || 'not_found', HTTP_STATUS.NOT_FOUND, ctx);
    }
    if (error instanceof ValidationException) {
      return this.errorResponse('bad_request', error.message || 'bad_request', HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse('unauthorized', error.message || 'unauthorized', HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      'internal_error',
      error instanceof Error ? error.message : 'internal_error',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ctx
    );
  }

  private errorResponse(code: string, message: string, statusCode: number, ctx: ApiContextFields): ApiResponse<never> {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale,
        },
      },
    };
  }
}

export default SupportController;
