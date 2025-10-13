import api from "@/lib/axios";
import {
  Provider,
  ListProvidersOpts,
  ListProvidersResponse,
  ProviderDetail,
} from "@/types/trade";

export async function listProviders(
  opts: ListProvidersOpts = {}
): Promise<ListProvidersResponse> {
  const params: Record<string, string | number> = {};

  if (opts.services && opts.services.length > 0)
    params.services = opts.services.join(",");
  if (opts.city) params.city = opts.city;
  if (opts.state) params.state = opts.state;
  if (opts.country) params.country = opts.country;
  if (typeof opts.min_rating === "number") params.min_rating = opts.min_rating;
  if (typeof opts.limit === "number") params.limit = opts.limit;
  if (typeof opts.offset === "number") params.offset = opts.offset;
  if (opts.search) params.search = opts.search;

  if (opts.services?.length! > 0) {
    if (opts.services!.includes("All")) {
      delete params.services;
    }
  }

  const res = await api.get<ListProvidersResponse>("/trade", { params });
  return res.data;
}

export const getProviderDetail = async (
  userId: string
): Promise<ProviderDetail> => {
  try {
    const { data } = await api.get<{ data: ProviderDetail }>(
      `/trade/${userId}`
    );
    return data.data;
  } catch (error: any) {
    console.error("Failed to fetch provider detail:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch provider detail"
    );
  }
};
