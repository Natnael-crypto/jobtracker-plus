import { useMutation, useQuery } from "@tanstack/react-query";

import {
  addProfileView,
  getBusinessDashboard,
  getProfileViews,
} from "@/services/dashboardApi";

export const useGetDashboard = () => {
  return useQuery({
    queryKey: ["useGetDashboard"],
    queryFn: getBusinessDashboard,
    staleTime: 60_000,
  });
};

export const useGetProfileViews = (day: number) => {
  return useQuery({
    queryKey: ["useGetDashboard", day],
    queryFn: ({ queryKey }) => getProfileViews(queryKey[1] as number),
    staleTime: 60_000,
  });
};

export function useAddProfileView() {
  return useMutation({
    mutationFn: (user_id: string) => addProfileView(user_id),
  });
}
