// components/ChatMessage.tsx
import { MessageDTO } from "@/types/messages";
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  msg: MessageDTO;
  isOutgoing: boolean;
  onEdit?: (id: string, current: string) => void;
  onDelete?: (id: string) => void;
}

export const ChatMessageBubble: React.FC<Props> = ({
  msg,
  isOutgoing,
  onEdit,
  onDelete,
}) => {
  const bubbleClass = isOutgoing
    ? "bg-[#EAF8F1] text-[#4F9C6D] ml-auto"
    : "bg-[#F0FDF5] text-gray-800 mr-auto";
  const containerAlignment = isOutgoing ? "items-end" : "items-start";

  const time = new Date(msg.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex flex-col w-full ${containerAlignment} my-4 px-6`}>
      {/* Time display */}
      <div
        className={`flex items-center text-xs text-gray-400 mb-1 ${
          isOutgoing ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <span>{time}</span>
      </div>

      {/* Message bubble */}
      <motion.div
        className={`relative group max-w-xs md:max-w-md p-4 rounded-2xl shadow-sm leading-relaxed text-sm transition duration-200 ${bubbleClass}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="whitespace-pre-wrap break-words">{msg.message}</p>

        {/* Edit & delete icons for own messages */}
        {msg.sender === "me" && (onEdit || onDelete) && (
          <div className="absolute -top-3 -right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && (
              <button
                onClick={() => onEdit(msg.id, msg.message)}
                className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition duration-150"
                title="Edit message"
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(msg.id)}
                className="p-1.5 bg-white rounded-full shadow hover:bg-red-50 transition duration-150"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
