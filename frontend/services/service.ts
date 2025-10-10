import axios from "axios";
import {
  Service,
  ServiceResponse,
  CreateServiceRequest,
} from "@/types/service";
import api from "@/lib/axios";

export const createService = async (
  payload: CreateServiceRequest
): Promise<ServiceResponse> => {
  const { data } = await api.post<ServiceResponse>(
    "/business/services",
    payload
  );
  return data;
};

export const deleteService = async (
  serviceId: string
): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(
    `/business/services/${serviceId}`
  );
  return data;
};

export const getServices = async (userId: string): Promise<Service[]> => {
  const { data } = await api.get<Service[]>(`/business/services/${userId}`);
  return data;
};

export const getMyServices = async (): Promise<Service[]> => {
  const { data } = await api.get<Service[]>("/business/my-services");
  return data;
};
