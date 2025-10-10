"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  deleteService,
  getMyServices,
} from "@/services/service";
import {
  ServiceResponse,
  CreateServiceRequest,
  Service,
} from "@/types/service";

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation<ServiceResponse, Error, CreateServiceRequest>({
    mutationFn: createService,
    onSuccess: (newService) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
    },
  });
}

export function useGetMyServices() {
  return useQuery<Service[], Error>({
    queryKey: ["my-services"],
    queryFn: getMyServices,
    retry: 3,
    refetchOnWindowFocus: false,
  });
}
