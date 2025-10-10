import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "@/services/notificationApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useNotifications = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => getNotifications(page, limit),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: getUnreadCount,
    refetchInterval: 10000, // optional: auto-refresh every 10s
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unreadCount"],
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unreadCount"],
      });
    },
  });
};
