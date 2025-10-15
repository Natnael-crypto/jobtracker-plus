import {
  fetchJobs,
  fetchUserByIDBusiness,
  fetchUserByIDClient,
  fetchUsers,
} from "@/services/admin";
import {
  JobDetail,
  JobDTO,
  JobIntent,
  PaginatedUsersResponse,
  UserDTO,
  UsersFilters,
} from "@/types/admin";
import {
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

export function useUsers(filters?: UsersFilters) {
  return useQuery<PaginatedUsersResponse, Error>({
    queryKey: ["users", filters],
    queryFn: () => fetchUsers(filters),
  });
}

export function useUsersInfinite(initialFilters?: UsersFilters) {
  const limit = initialFilters?.limit ?? 20;

  return useQuery<PaginatedUsersResponse, Error>({
    queryKey: ["users", initialFilters],
    queryFn: () => fetchUsers({ ...initialFilters, limit }),
  });
}

export function useUserByIDClient(id: string | undefined) {
  return useQuery<{ user: UserDTO; jobs: JobDTO[] }, Error>({
    queryKey: ["user", "client", id],
    queryFn: () => fetchUserByIDClient(id!),
  });
}

export function useUserByIDBusiness(id: string | undefined) {
  return useQuery<{ user: UserDTO; jobs: JobIntent[] }, Error>({
    queryKey: ["user", "business", id],
    queryFn: () => fetchUserByIDBusiness(id!),
  });
}

export function useGetAllJobs(
  limit: number,
  offset: number,
  search?: string,
  status?: string
) {
  return useQuery<{ jobs: JobDetail[]; total: number }, Error>({
    queryKey: ["jobsAll", limit, offset, search],
    queryFn: () => fetchJobs(limit, offset, search, status),
  });
}
