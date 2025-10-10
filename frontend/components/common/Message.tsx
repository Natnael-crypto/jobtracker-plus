"use client";

import React, { useMemo, useState } from "react";

import { ChatMessageBubble } from "./ChatMessage";
import {
  useDeleteMessage,
  useMessages,
  useSendMessage,
  useUpdateMessage,
} from "@/hooks/useMessages";

interface Props {
  jobId: string;
}

export const ChatInterfaceInner: React.FC<Props> = ({ jobId }) => {
  const { data: messages = [], isLoading, isError } = useMessages(jobId);

  const createMessage = useSendMessage(jobId);
  const updateMessage = useUpdateMessage(jobId);
  const deleteMessage = useDeleteMessage(jobId);

  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(
    null
  );

  // const ordered = useMemo(() => {
  //   return [...messages].sort(
  //     (a, b) => a.created_at.getTime() - b.created_at.getTime()
  //   );
  // }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = (editing ? editing.text : draft).trim();
    if (!text) return;

    if (editing) {
      updateMessage.mutate(
        { messageID: editing.id, message: editing.text },
        {
          onSuccess: () => setEditing(null),
        }
      );
    } else {
      createMessage.mutate(text, {
        onSuccess: () => setDraft(""),
      });
    }
  };

  const startEdit = (id: string, current: string) => {
    setEditing({ id, text: current });
  };

  const cancelEdit = () => setEditing(null);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this message?")) return;
    deleteMessage.mutate(id);
  };

  return (
    <div className="flex items-start justify-center w-full">
      <div className="bg-white w-full max-h-[640px] rounded-lg flex flex-col shadow">
        <div className="flex-grow overflow-y-auto p-4">
          {isLoading && (
            <div className="text-center text-sm text-gray-500">Loading...</div>
          )}
          {isError && (
            <div className="text-center text-sm text-red-500">
              Failed to load messages.
            </div>
          )}

          {messages.length == 0 && !isLoading && (
            <div className="text-center text-sm text-gray-400 mt-6">
              No messages yet — say hello 👋
            </div>
          )}

          {messages.map((m) => {
            const isOutgoing = m.sender === "me";
            return (
              <ChatMessageBubble
                key={m.id}
                msg={m}
                isOutgoing={isOutgoing}
                onDelete={handleDelete}
                onEdit={startEdit}
              />
            );
          })}
        </div>

        <div className="border-t border-gray-100 p-4">
          <form onSubmit={handleSend} className="flex items-center space-x-4">
            <input
              type="text"
              value={editing ? editing.text : draft}
              onChange={(e) =>
                editing
                  ? setEditing((s) => s && { ...s, text: e.target.value })
                  : setDraft(e.target.value)
              }
              placeholder={editing ? "Edit message" : "Type a message"}
              className="flex-grow px-4 py-3 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 shadow-inner"
            />

            {editing ? (
              <>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-600 text-white"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition duration-200 shadow-md"
                style={{
                  backgroundColor: "#4F9C6D",
                  boxShadow:
                    "0 4px 6px -1px rgba(79, 156, 109, 0.4), 0 2px 4px -2px rgba(79, 156, 109, 0.4)",
                }}
                aria-label="Send Message"
              >
                Send
                <svg
                  className="inline-block ml-2 h-4 w-4 -mt-px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 15 2 11 22 2"></polygon>
                </svg>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterfaceInner;
