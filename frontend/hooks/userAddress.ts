import { getUserAddress, updateUserAddress } from "@/services/userAddress";
import { UserAddress, UpdateUserAddressRequest } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserAddress() {
  return useQuery<UserAddress, Error>({
    queryKey: ["userAddress"],
    queryFn: getUserAddress,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });
}

export function useUpdateUserAddress() {
  const queryClient = useQueryClient();

  return useMutation<UserAddress, Error, UpdateUserAddressRequest>({
    mutationFn: updateUserAddress,
    onSuccess: (data) => {
      queryClient.setQueryData(["userAddress"], data);
    },
  });
}
