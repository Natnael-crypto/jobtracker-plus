export type InvoiceStatus = "paid" | "overdue" | "in_progress";

export interface LineItem {
  id: string;
  parent_id?: string | null;
  type: "Invoice" | "Quotation";
  service?: string;
  unit?: number;
  quantity: number;
  rate?: number;
  total?: number;
  description?: string;
}

export interface Invoice {
  id: string;
  job_id: string;
  user_id: string;
  discount: number;
  tax: number;
  total: number;
  terms_and_conditions?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  logo_url?: string | null;
  job_title?: string | null;
  status: InvoiceStatus;
  created_at: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_name: string;
  bank_routing_number: string;
  sort_code: string;
  due_date: string;
  line_items?: LineItem[];
}

export interface CreateInvoiceRequest {
  job_id: string;
  discount?: number;
  tax?: number;
  terms_and_conditions?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  job_title?: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_name: string;
  bank_routing_number: string;
  sort_code: string;
  due_date: string;
  line_items?: Omit<LineItem, "id" | "parent_id">[];
}

export interface CreateInvoiceResponse {
  invoice: Invoice;
  line_items: LineItem[];
}

export interface GetInvoiceResponse {
  invoice: Invoice;
  line_items: LineItem[];
}

export interface UpdateInvoicesRequest {
  status: InvoiceStatus;
}

export interface Invoice2 {
  id: string;
  job_id: string;
  user_id: string;
  status: "paid" | "overdue" | "in_progress";
  discount: number;
  tax: number;
  total: number;
  job_title?: string;
  created_at: string;
  due_date: string;
}

export interface PaginatedInvoicesResponse {
  data: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
