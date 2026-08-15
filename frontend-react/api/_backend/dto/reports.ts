export interface ReportFilterDto {
  readonly startDate?: string;
  readonly endDate?: string;
  readonly status?: string;
  readonly search?: string;
  readonly page?: number;
  readonly limit?: number;
}

export interface DashboardKpiSummary {
  readonly totalRevenue: number;
  readonly totalOrders: number;
  readonly completedOrders: number;
  readonly pendingOrders: number;
  readonly totalCustomers: number;
  readonly totalProducts: number;
  readonly lowStockProducts: number;
  readonly openSupportTickets: number;
}
