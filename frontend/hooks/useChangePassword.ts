import { changePassword } from "@/services/auth";
import { ChangePasswordRequest } from "@/types/user";
import { StandardResponse } from "@/types/userProfile";
import { useMutation } from "@tanstack/react-query";

export const useChangePassword = () => {
  return useMutation<StandardResponse, Error, ChangePasswordRequest>({
    mutationFn: (payload) => changePassword(payload),
  });
};
