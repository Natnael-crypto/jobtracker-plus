export type QuotationStatus = "rejected" | "accepted" | "in_progress";

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

export interface Quotation {
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
  status: QuotationStatus;
  created_at: string;
  line_items?: LineItem[];
}

export interface CreateQuotationRequest {
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
  line_items?: Omit<LineItem, "id" | "parent_id">[];
}

export interface CreateQuotationResponse {
  quotation: Quotation;
  line_items: LineItem[];
}

export interface GetQuotationResponse {
  quotation: Quotation;
  line_items: LineItem[];
}

export interface UpdateQuotationRequest {
  status: QuotationStatus;
}
