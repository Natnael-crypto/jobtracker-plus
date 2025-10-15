import { JobResponse } from "./jobs";

export type UserDTO = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  image_url?: string | null;
  email_verified: boolean;
  identity_verified: boolean;
  created_at: string;
  role: string;
  status: string;
};

export type BidDTO = {
  job_id: string;
  bid_id: string;
  status: string;
  user_detail: UserDTO;
  created_at: string;
};

export type InvitationDTO = {
  job_id: string;
  invite_id: string;
  status: string;
  user_detail: UserDTO;
  created_at: string;
};

export type JobDTO = {
  job: Record<string, any>;
  bids: BidDTO[];
  invites: InvitationDTO[];
};

export type JobIntent = {
  Job: JobResponse;
  Type: string;
  Status: string;
};

export type PaginatedUsersResponse = {
  total: number;
  data: UserDTO[];
};

export type JobDetail = {
  job: JobResponse;
  created_by: UserDTO;
  bids: BidDTO[];
  invites: InvitationDTO[];
};

export type UsersFilters = {
  role?: string;
  status?: string;
  search?: string;
  email_verified?: boolean;
  identity_verified?: boolean;
  created_after?: string;
  created_before?: string;
  limit?: number;
  offset?: number;
};
