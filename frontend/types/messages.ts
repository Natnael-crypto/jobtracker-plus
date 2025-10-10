export interface MessageDTO {
  id: string;
  user_id: string;
  job_id: string;
  message: string;
  created_at: string; // ISO string from backend
  sender?: "me" | "other"; // server includes "sender" in your service; but we compute client-side too
}

export interface ChatMessage {
  id: string;
  user_id: string;
  job_id: string;
  message: string;
  created_at: Date;
  sender: "me" | "other";
}
