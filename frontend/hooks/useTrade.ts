import { useQuery } from "@tanstack/react-query";
import { getProviderDetail, listProviders } from "@/services/trade";
import {
  Provider,
  ListProvidersOpts,
  ListProvidersResponse,
  ProviderDetail,
} from "@/types/trade";

export function useProviders(opts: ListProvidersOpts = {}) {
  return useQuery<ListProvidersResponse, Error>({
    queryKey: ["providers", opts],
    queryFn: () => listProviders(opts),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export const useProvider = (userId: string) => {
  return useQuery<ProviderDetail, Error>({
    queryKey: ["provider", userId],
    queryFn: () => getProviderDetail(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
