import api from "@/lib/axios";
import {
  Qualification,
  CreateQualificationRequest,
  UpdateQualificationRequest,
} from "@/types/qualification";

export async function getMyQualifications(): Promise<Qualification[]> {
  const { data } = await api.get("/business/my-qualifications");
  return data;
}

export async function getUserQualifications(
  userId: string
): Promise<Qualification[]> {
  const { data } = await api.get(`/qualifications/user/${userId}`);
  return data;
}

export async function createQualification(
  payload: CreateQualificationRequest
): Promise<Qualification> {
  const { data } = await api.post("/business/qualifications", payload);
  return data;
}

export async function updateQualification(
  payload: UpdateQualificationRequest
): Promise<Qualification> {
  const { qualification_id, ...body } = payload;
  const { data } = await api.put(
    `/business/qualifications/${qualification_id}`,
    body
  );
  return data;
}

export async function deleteQualification(
  qualificationId: string
): Promise<{ message: string }> {
  const { data } = await api.delete(
    `/business/qualifications/${qualificationId}`
  );
  return data;
}
