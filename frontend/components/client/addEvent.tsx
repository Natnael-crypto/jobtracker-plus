"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSaveEvent } from "@/hooks/useEvents";
import { useQueryClient } from "@tanstack/react-query";

interface EventModalProps {
  eventModal: boolean;
  setEventModal: (open: boolean) => void;
  event?: {
    id: string;
    title: string;
    day: string;
    start_time: string;
    end_time: string;
    description?: string;
  } | null;
}

export default function EventModal({
  eventModal,
  setEventModal,
  event,
}: EventModalProps) {
  const { mutate: saveEvent } = useSaveEvent();

  const [title, setTitle] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDay(event.day);
      setStartTime(event.start_time);
      setEndTime(event.end_time);
      setDescription(event.description || "");
    } else {
      setTitle("");
      setDay(new Date().toISOString().split("T")[0]);
      setStartTime("");
      setEndTime("");
      setDescription("");
    }
  }, [event, eventModal]);

  const handleSubmit = async () => {
    try {
      await saveEvent({
        id: event?.id,
        title,
        day,
        start_time: startTime,
        end_time: endTime,
        description,
      });
      setEventModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to save event:", err);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={eventModal} onOpenChange={setEventModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? "Update Event" : "Add Event"}</DialogTitle>
          <DialogDescription>
            {event
              ? "Update the details of your event."
              : "Fill in the details below to add a new event."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            type="date"
            value={day}
            min={today}
            onChange={(e) => setDay(e.target.value)}
          />

          <Input
            type="time"
            value={startTime}
            min={
              day === today ? new Date().toTimeString().slice(0, 5) : "00:00"
            }
            onChange={(e) => setStartTime(e.target.value)}
          />

          <Input
            type="time"
            value={endTime}
            min={startTime || "00:00"}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setEventModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{event ? "Update" : "Add"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
