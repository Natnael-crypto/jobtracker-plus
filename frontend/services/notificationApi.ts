import api from "@/lib/axios";
import { Notification1, PaginatedResponse } from "@/types/notification";

export const getNotifications = async (page = 1, limit = 10) => {
  const res = await api.get<PaginatedResponse<Notification1>>(
    `/notifications`,
    {
      params: { page, limit },
    }
  );
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await api.get<{ unread_count: number }>(
    `/notifications/unread/count`
  );
  return res.data.unread_count;
};

export const markAsRead = async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
};

export const deleteNotification = async (id: string) => {
  await api.delete(`/notifications/${id}`);
};
