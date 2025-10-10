import api from "@/lib/axios";
import { UpdateUserAddressRequest, UserAddress } from "@/types/user";

export async function getUserAddress(): Promise<UserAddress> {
  const { data } = await api.get<UserAddress>("/user/address");
  return data;
}

export async function updateUserAddress(
  address: UpdateUserAddressRequest
): Promise<UserAddress> {
  const { data } = await api.put<UserAddress>("/user/address", address);
  return data;
}
