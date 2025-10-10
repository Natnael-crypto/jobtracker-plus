"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEventsByDay,
  createOrUpdateEvent,
  deleteEvent as deleteEventAPI,
} from "@/services/event";
import { EventPayload, Events } from "@/types/event";

// 1. Fetch events by day
export function useFetchEvents(day: string) {
  return useQuery<Events[], Error>({
    queryKey: ["events", day],
    queryFn: () => getEventsByDay(day),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useSaveEvent() {
  const queryClient = useQueryClient();

  return useMutation<Events, Error, EventPayload>({
    mutationFn: (payload) => createOrUpdateEvent(payload),
    onSuccess: (savedEvent) => {
      queryClient.setQueryData<Events[]>(["events", savedEvent.day], (old) => {
        if (!old) return [savedEvent];
        const idx = old.findIndex((e) => e.id === savedEvent.id);
        if (idx >= 0) {
          const copy = [...old];
          copy[idx] = savedEvent;
          return copy;
        }
        return [...old, savedEvent];
      });
    },
  });
}

export function useDeleteEvent(day: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, unknown>({
    mutationFn: (id) => deleteEventAPI(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Events[]>(["events", day], (old) => {
        if (!old) return [];
        return old.filter((e) => e.id !== id);
      });
    },
  });
}
