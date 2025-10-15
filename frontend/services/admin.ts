import api from "@/lib/axios";
import {
  JobDetail,
  JobDTO,
  JobIntent,
  PaginatedUsersResponse,
  UserDTO,
  UsersFilters,
} from "@/types/admin";

function buildQueryParams(filters?: UsersFilters) {
  const params = new URLSearchParams();
  if (!filters) return params;
  if (filters.role) params.set("role", filters.role);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  if (typeof filters.email_verified === "boolean")
    params.set("email_verified", String(filters.email_verified));
  if (typeof filters.identity_verified === "boolean")
    params.set("identity_verified", String(filters.identity_verified));
  if (filters.created_after) params.set("created_after", filters.created_after);
  if (filters.created_before)
    params.set("created_before", filters.created_before);
  if (typeof filters.limit === "number")
    params.set("limit", String(filters.limit));
  if (typeof filters.offset === "number")
    params.set("offset", String(filters.offset));
  return params;
}

export async function fetchUsers(
  filters?: UsersFilters
): Promise<PaginatedUsersResponse> {
  const params = buildQueryParams(filters);
  const { data } = await api.get<PaginatedUsersResponse>(
    `/admin/users?${params.toString()}`
  );
  return data;
}

export async function fetchUserByIDClient(
  id: string
): Promise<{ user: UserDTO; jobs: JobDTO[] }> {
  const { data } = await api.get<{ user: UserDTO; jobs: JobDTO[] }>(
    `/admin/users/${id}/client`
  );
  return data;
}

export async function fetchUserByIDBusiness(
  id: string
): Promise<{ user: UserDTO; jobs: JobIntent[] }> {
  const { data } = await api.get<{ user: UserDTO; jobs: JobIntent[] }>(
    `/admin/users/${id}/business`
  );
  return data;
}

export async function fetchJobs(
  limit: number,
  offset: number,
  search?: string,
  status?: string
): Promise<{
  jobs: JobDetail[];
  total: number;
  limit: number;
  offset: number;
}> {
  const res = await api.get(`/admin/jobs`, {
    params: { limit, offset, search, status },
  });

  const raw = res.data;
  return {
    jobs: raw.data || [],
    total: raw.total || 0,
    limit: raw.limit || limit,
    offset: raw.offset || offset,
  };
}
