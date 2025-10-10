"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useDeleteNotification,
  useMarkAsRead,
  useNotifications,
} from "@/hooks/useNotifications";
import { formatDateToReadable } from "@/lib/date_converter";
import { Notification1 } from "@/types/notification";
import { cn } from "@/lib/utils";

const NotificationsPage: React.FC = () => {
  const [selected, setSelected] = useState<Notification1 | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, isFetching } = useNotifications(
    page,
    limit
  );
  const { mutate: markAsRead, isPending: marking } = useMarkAsRead();
  const { mutate: deleteNotification, isPending: deleting } =
    useDeleteNotification();

  const notifications = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleMarkRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  if (isLoading)
    return <div className="text-center mt-10">Loading notifications...</div>;
  if (isError)
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load notifications.
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-green-600" />
          Notifications
        </h1>

        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10 border rounded-lg">
            No notifications found.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <Card
                key={n.id}
                onClick={() => setSelected(n)}
                className={cn(
                  "cursor-pointer hover:shadow transition-all border rounded-lg",
                  n.read_at ? "bg-gray-50" : "bg-white"
                )}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h2
                      className={cn(
                        "font-medium",
                        n.read_at ? "text-gray-600" : "text-gray-900"
                      )}
                    >
                      {n.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {n.description}
                    </p>
                    <span className="text-xs text-gray-400">
                      {formatDateToReadable(n.created_at)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {n.read_at == null ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={marking}
                        onClick={(e) => handleMarkRead(e, n.id)}
                      >
                        Mark Read
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deleting}
                        onClick={(e) => handleDelete(e, n.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>

            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-lg">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>{selected.title}</DialogTitle>
                  <DialogDescription>
                    {formatDateToReadable(selected.created_at)}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-2 text-gray-700 whitespace-pre-line">
                  {selected.description}
                </div>

                <DialogFooter className="flex justify-between gap-2">
                  {selected.read_at == null && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={marking}
                      onClick={(e) => handleMarkRead(e, selected.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleting}
                    onClick={(e) => handleDelete(e, selected.id)}
                  >
                    Delete
                  </Button>
                  <Button variant="secondary" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default NotificationsPage;
