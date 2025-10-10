"use client";

import { Events } from "@/types/event";
import {
  addDays,
  format,
  isToday,
  startOfWeek,
  parse,
  format as formatDate,
  set,
} from "date-fns";
import { Button } from "../ui/button";
import {
  PIXEL_PER_HOUR,
  PIXEL_PER_MINUTE,
  TIME_END_HOUR,
  TIME_START_HOUR,
} from "@/app/client/schedule/page";
import EventModal from "../client/addEvent";
import { use, useMemo, useState } from "react";
import EventDetailModal from "./EventDetailModal";
import { deleteEvent } from "@/services/event";
import { useQueryClient } from "@tanstack/react-query";

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Format "23:26" -> "11:26 PM"
const formatTo12Hour = (time: string) => {
  const parsed = parse(time, "HH:mm", new Date());
  return formatDate(parsed, "hh:mm a");
};

const getEventStyles = (event: Events) => {
  const startMins = timeToMinutes(event.start_time);
  const endMins = timeToMinutes(event.end_time);

  const durationMins = endMins - startMins;
  const offsetMins = startMins - timeToMinutes(`${TIME_START_HOUR}:00`);

  const topPx = offsetMins * PIXEL_PER_MINUTE;
  const heightPx = durationMins * PIXEL_PER_MINUTE;

  const HEADER_ROW_HEIGHT = PIXEL_PER_HOUR;
  let totalTopPx = HEADER_ROW_HEIGHT + topPx;

  totalTopPx -= 2 * PIXEL_PER_HOUR;

  return {
    top: `${totalTopPx}px`,
    height: `${heightPx}px`,
  };
};

const TIME_SLOTS_12H = Array.from({ length: 24 }, (_, i) => {
  const hour24 = (i + 1) % 24; // shift by 1 to start at 1 AM
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const suffix = hour24 < 12 ? "AM" : "PM";
  return `${hour12} ${suffix}`;
});

const EventCard: React.FC<{
  event: Events;
  onClick: (event: Events) => void;
}> = ({ event, onClick }) => {
  const position = useMemo(() => getEventStyles(event), [event]);

  return (
    <div
      className="absolute w-[95%] rounded-lg p-2 text-xs font-medium bg-[#EDEDED] border-l-4 border-[#5BBB7B] z-10 cursor-pointer"
      style={{ top: position.top, height: position.height }}
      onClick={() => onClick(event)}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <p className="font-base truncate leading-tight text-gray-800">
          {event.title}
        </p>
        <p className="mt-1 text-[10px] opacity-80 leading-tight truncate">
          {event.description}
        </p>
        <p className="mt-1 text-[10px] text-gray-600">
          {formatTo12Hour(event.start_time)} - {formatTo12Hour(event.end_time)}
        </p>
      </div>
    </div>
  );
};

export const ScheduleView: React.FC<{
  events: Events[];
  currentDate: Date;
}> = ({ events, currentDate }) => {
  const queryClient = useQueryClient();
  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [eventUpdate, setEventUpdate] = useState(false);

  const daysInWeek = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeekDate, i);
    return {
      date,
      day: format(date, "d"),
      name: format(date, "EEE"),
      isToday: isToday(date),
      dayIndex: i,
    };
  });

  const handleEventClick = (event: Events) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleUpdate = (event: Events) => {
    console.log("Update event:", event);
    setEventUpdate(!eventUpdate);
    setEventsModal(false);
  };

  const handleDelete = (id: string) => {
    console.log("Delete event with id:", id);
    deleteEvent(id);
    setModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  const groupedEvents: Record<number, Events[]> = events.reduce(
    (acc, eventItem) => {
      let eventDayIndex = daysInWeek.findIndex(
        (day) =>
          format(day.date, "yyyy-MM-dd") ===
          format(new Date(eventItem.day), "yyyy-MM-dd")
      );
      if (eventDayIndex !== -1) {
        acc[eventDayIndex] = acc[eventDayIndex] || [];
        acc[eventDayIndex].push(eventItem);
      }
      return acc;
    },
    {} as Record<number, Events[]>
  );

  const [eventsModal, setEventsModal] = useState(false);

  return (
    <div className="flex-1 border-r border-gray-100 pr-8">
      <div className="flex items-center justify-between text-base font-semibold mb-6">
        <span className="text-gray-600 mr-4">
          {format(startOfWeekDate, "MMMM d")} -{" "}
          {format(addDays(startOfWeekDate, 6), "d")}
        </span>
        <Button onClick={() => setEventsModal(true)}>Add Event</Button>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-[80px_repeat(7,_1fr)] text-xs font-semibold text-gray-400 border-b border-gray-100">
        <div className="py-3 text-right text-lg font-extralight pr-4">Week</div>
        {daysInWeek.map((day) => (
          <div
            key={day.date.toString()}
            className={`flex flex-col items-center py-3 text-center transition duration-150 ${
              day.day == currentDate.getDate().toString()
                ? "text-black"
                : "text-gray-500"
            }`}
          >
            <span
              className={`text-base font-light mb-1 ${
                day.day == currentDate.getDate().toString()
                  ? "text-black"
                  : "text-gray-500"
              }`}
            >
              {day.day}
            </span>
            <span className="text-base font-light">{day.name}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[80px_repeat(7,_1fr)]">
        {/* Time labels */}
        <div className="flex flex-col text-right text-base text-gray-400 pt-1">
          {TIME_SLOTS_12H.map((label, index) => (
            <div
              key={label}
              className={`border-b border-gray-100 ${
                index === 0 ? "border-t" : ""
              } pr-4`}
              style={{ height: `${PIXEL_PER_HOUR}px` }}
            >
              <span className="relative -top-3">{label}</span>
            </div>
          ))}
        </div>

        {/* Events */}
        {daysInWeek.map((day) => (
          <div
            key={day.date.toString()}
            className={`relative border-l border-gray-100 ${
              day.isToday ? "bg-gray-50/50" : ""
            }`}
          >
            {TIME_SLOTS_12H.slice(0, -1).map((label) => (
              <div
                key={label}
                className="border-b border-gray-100"
                style={{ height: `${PIXEL_PER_HOUR}px` }}
              ></div>
            ))}
            {groupedEvents[day.dayIndex]?.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={handleEventClick}
              />
            ))}
          </div>
        ))}
      </div>

      {eventsModal && eventUpdate ? (
        <EventModal
          eventModal={eventsModal}
          setEventModal={setEventsModal}
          event={selectedEvent}
        />
      ) : (
        eventsModal && (
          <EventModal eventModal={eventsModal} setEventModal={setEventsModal} />
        )
      )}
      {modalOpen && (
        <EventDetailModal
          open={modalOpen}
          setOpen={setModalOpen}
          event={selectedEvent}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
