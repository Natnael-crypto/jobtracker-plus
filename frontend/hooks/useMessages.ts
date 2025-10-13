// hooks/useMessages.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage, MessageDTO } from "@/types/messages";
import api from "@/lib/axios";

/* ---------------------------------- API Calls ------------------------------ */
const fetchConversation = async (jobID: string): Promise<MessageDTO[]> => {
  const { data } = await api.get<MessageDTO[]>(`/messages/job/${jobID}`);
  return data;
};

const postMessage = async (
  jobID: string,
  message: string
): Promise<MessageDTO> => {
  const { data } = await api.post<MessageDTO>(`/messages/job/${jobID}`, {
    message,
  });
  return data;
};

const putMessage = async (
  messageID: string,
  message: string
): Promise<MessageDTO> => {
  const { data } = await api.put<MessageDTO>(`/messages/${messageID}`, {
    message,
  });
  return data;
};

const deleteMessageApi = async (messageID: string): Promise<{ id: string }> => {
  await api.delete(`/messages/${messageID}`);
  return { id: messageID };
};

export const useMessages = (jobID: string) => {
  return useQuery({
    queryKey: ["messages", jobID],
    queryFn: async () => {
      return await fetchConversation(jobID);
    },
    staleTime: 5 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    enabled: Boolean(jobID),
  });
};

export const useSendMessage = (jobID: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) => postMessage(jobID, message),
    onMutate: async (message) => {
      await queryClient.cancelQueries({ queryKey: ["messages", jobID] });

      const prevMessages =
        queryClient.getQueryData<ChatMessage[]>(["messages", jobID]) || [];

      const optimisticMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        user_id: "me",
        job_id: jobID,
        message,
        created_at: new Date(),
        sender: "me",
      };

      queryClient.setQueryData(
        ["messages", jobID],
        [...prevMessages, optimisticMsg]
      );

      return { prevMessages };
    },
    onError: (error, _, context) => {
      if (context?.prevMessages) {
        queryClient.setQueryData(["messages", jobID], context.prevMessages);
      }
      console.error("Failed to send message:", error);
    },
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries({ queryKey: ["messages", jobID] });
    },
  });
};

export const useUpdateMessage = (jobID: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageID,
      message,
    }: {
      messageID: string;
      message: string;
    }) => putMessage(messageID, message),
    onMutate: async ({ messageID, message }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", jobID] });

      const prevMessages =
        queryClient.getQueryData<ChatMessage[]>(["messages", jobID]) || [];

      queryClient.setQueryData(
        ["messages", jobID],
        prevMessages.map((msg) =>
          msg.id === messageID ? { ...msg, message } : msg
        )
      );

      return { prevMessages };
    },
    onError: (error, _, context) => {
      if (context?.prevMessages) {
        queryClient.setQueryData(["messages", jobID], context.prevMessages);
      }
      console.error("Failed to update message:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", jobID] });
    },
  });
};

export const useDeleteMessage = (jobID: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageID: string) => deleteMessageApi(messageID),
    onMutate: async (messageID) => {
      await queryClient.cancelQueries({ queryKey: ["messages", jobID] });

      const prevMessages =
        queryClient.getQueryData<ChatMessage[]>(["messages", jobID]) || [];

      queryClient.setQueryData(
        ["messages", jobID],
        prevMessages.filter((msg) => msg.id !== messageID)
      );

      return { prevMessages };
    },
    onError: (error, _, context) => {
      if (context?.prevMessages) {
        queryClient.setQueryData(["messages", jobID], context.prevMessages);
      }
      console.error("Failed to delete message:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", jobID] });
    },
  });
};
