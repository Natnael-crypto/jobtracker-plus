export interface EventPayload {
  id?: string; // if exists → update
  title: string;
  day: string; // YYYY-MM-DD
  start_time: string;
  end_time: string;
  description?: string;
  job_id?: string | null;
}

export interface Events {
  id: string;
  user_id: string;
  title: string;
  day: string;
  start_time: string;
  end_time: string;
  description?: string;
  job_id?: string | null;
  created_at: string;
}
