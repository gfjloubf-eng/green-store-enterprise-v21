export interface CreateTicketDto {
  readonly subject: string;
  readonly description: string;
  readonly priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface ReplyTicketDto {
  readonly ticketId: string;
  readonly message: string;
}

export interface UpdateTicketStatusDto {
  readonly status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
}
