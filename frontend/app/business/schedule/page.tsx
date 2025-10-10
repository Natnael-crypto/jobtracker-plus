"use client";

import React, { useState, useEffect } from "react";

import { MiniCalendar } from "@/components/common/MiniCalendar";
import { ScheduleView } from "@/components/common/ScheduleView";
import { useFetchEvents } from "@/hooks/useEvents";

export const TIME_START_HOUR = 0;
export const TIME_END_HOUR = 24;
export const TIME_SLOTS_12H = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const suffix = i < 12 ? "AM" : "PM";
  return `${hour} ${suffix}`;
});

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const PIXEL_PER_HOUR = 60;
export const PIXEL_PER_MINUTE = PIXEL_PER_HOUR / 60;

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const { data: events } = useFetchEvents(currentDate.toLocaleString());

  return (
    <div className="min-h-screen text-gray-900 antialiased p-6 md:p-10">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">My schedule</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8  p-6">
        {events != undefined && (
          <ScheduleView events={events!} currentDate={currentDate} />
        )}

        <div className="lg:w-96 pt-6">
          <MiniCalendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </div>
      </div>
    </div>
  );
}
