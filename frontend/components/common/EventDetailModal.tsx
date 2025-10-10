"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Events } from "@/types/event";

interface EventDetailModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  event: Events | null;
  onUpdate: (event: Events) => void;
  onDelete: (id: string) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  open,
  setOpen,
  event,
  onUpdate,
  onDelete,
}) => {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg bg-white text-black rounded-2xl shadow-lg border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Event Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex justify-between text-sm text-gray-700">
            <span className="font-medium">Date:</span>
            <span>{event.day}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span className="font-medium">Time:</span>
            <span>
              {event.start_time} - {event.end_time}
            </span>
          </div>
          {event.description && (
            <div className="text-sm text-gray-700">
              <span className="font-medium">Description: </span>
              <p className="mt-1 text-gray-600">{event.description}</p>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-700">
            <span className="font-medium">Created At:</span>
            <span>{new Date(event.created_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            className="border-gray-400 text-gray-800 hover:bg-gray-100"
            onClick={() => onUpdate(event)}
          >
            Update
          </Button>
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => onDelete(event.id)}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;
