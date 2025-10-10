import api from "@/lib/axios";
import { EventPayload, Events } from "@/types/event";

export async function createOrUpdateEvent(
  payload: EventPayload
): Promise<Events> {
  const url = payload.id ? `/events/${payload.id}` : `/events`;
  const method = payload.id ? "PUT" : "POST";

  if (method === "PUT") {
    const res = await api.put(url, payload);
    return res.data;
  } else {
    const res = await api.post(url, payload);
    return res.data;
  }
}

export async function getEventsByDay(day: string): Promise<Events[]> {
  const url = `/events?day=${day}`;
  const res = await api.get(url);

  return res.data;
}

export async function deleteEvent(id: string): Promise<void> {
  const url = `/events/${id}`;
  await api.delete(url);
}
