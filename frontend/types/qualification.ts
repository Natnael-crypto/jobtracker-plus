export interface Qualification {
  id: string;
  user_id: string;
  type: "Education" | "Award";
  title?: string;
  start_year?: number;
  end_year?: number;
  institute?: string;
  description?: string;
  created_at: string;
}

export interface CreateQualificationRequest {
  type: "Education" | "Award";
  title: string;
  start_year?: number;
  end_year?: number;
  institute?: string;
  description?: string;
}

export interface UpdateQualificationRequest {
  qualification_id: string;
  title?: string;
  start_year?: number;
  end_year?: number;
  institute?: string;
  description?: string;
}
